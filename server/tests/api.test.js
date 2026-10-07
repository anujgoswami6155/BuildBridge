import test, { describe, before, after } from "node:test";
import assert from "node:assert/strict";
import mongoose from "mongoose";
import app from "../src/app.js";
import User from "../src/models/User.models.js";
import Project from "../src/models/Project.models.js";
import Task from "../src/models/Task.models.js";
import Application from "../src/models/Application.models.js";
import Comment from "../src/models/Comment.models.js";

describe("BuildBridge API Integration Test Suite", () => {
    let server;
    let baseUrl;

    // Test users and tokens
    let user1 = {
        name: "Alice Builder",
        email: `alice_${Date.now()}@buildbridge.test`,
        password: "Password123!"
    };
    let user2 = {
        name: "Bob Developer",
        email: `bob_${Date.now()}@buildbridge.test`,
        password: "Password123!"
    };

    let token1 = "";
    let user1Id = "";
    let token2 = "";
    let user2Id = "";

    // Test artifacts
    let testProjectId = "";
    let testApplicationId = "";
    let testTaskId = "";
    let testCommentId = "";

    before(async () => {
        // Wait for mongoose connection if not ready
        if (mongoose.connection.readyState !== 1) {
            await mongoose.connect(process.env.MONGO_URI);
        }

        // Start server on random available port
        await new Promise((resolve) => {
            server = app.listen(0, () => {
                const port = server.address().port;
                baseUrl = `http://127.0.0.1:${port}`;
                resolve();
            });
        });
    });

    after(async () => {
        // Clean up test entities created
        try {
            if (testProjectId) {
                await Project.findByIdAndDelete(testProjectId);
                await Task.deleteMany({ project: testProjectId });
                await Application.deleteMany({ project: testProjectId });
                await Comment.deleteMany({ project: testProjectId });
            }
            if (user1Id) await User.findByIdAndDelete(user1Id);
            if (user2Id) await User.findByIdAndDelete(user2Id);
        } catch (err) {
            console.error("Cleanup error:", err);
        }

        if (server) {
            if (typeof server.closeAllConnections === "function") {
                server.closeAllConnections();
            }
            await new Promise((resolve) => server.close(resolve));
        }
        await mongoose.disconnect();
    });

    // Helper request function
    const request = async (endpoint, options = {}) => {
        const url = `${baseUrl}${endpoint}`;
        const headers = {
            "Content-Type": "application/json",
            ...options.headers
        };
        const res = await fetch(url, {
            method: options.method || "GET",
            headers,
            body: options.body ? JSON.stringify(options.body) : undefined
        });
        const text = await res.text();
        let data;
        try {
            data = JSON.parse(text);
        } catch {
            data = text;
        }
        return { status: res.status, data };
    };

    // 1. Health & Root Tests
    test("GET / - returns server status", async () => {
        const { status, data } = await request("/");
        assert.equal(status, 200);
        assert.equal(data.status, "online");
    });

    test("GET /api/health - returns healthy", async () => {
        const { status, data } = await request("/api/health");
        assert.equal(status, 200);
        assert.equal(data.status, "healthy");
    });

    test("GET /api/nonexistent - returns 404 JSON", async () => {
        const { status, data } = await request("/api/nonexistent");
        assert.equal(status, 404);
        assert.ok(data.message.includes("not found"));
    });

    // 2. Auth Flow Tests
    test("POST /api/auth/register - validation failures", async () => {
        // Missing fields
        const r1 = await request("/api/auth/register", {
            method: "POST",
            body: { name: "Alice" }
        });
        assert.equal(r1.status, 400);

        // Invalid email
        const r2 = await request("/api/auth/register", {
            method: "POST",
            body: { name: "Alice", email: "invalid-email", password: "Password123!" }
        });
        assert.equal(r2.status, 400);

        // Short password
        const r3 = await request("/api/auth/register", {
            method: "POST",
            body: { name: "Alice", email: "alice@test.com", password: "123" }
        });
        assert.equal(r3.status, 400);
    });

    test("POST /api/auth/register - successful registration", async () => {
        const res1 = await request("/api/auth/register", {
            method: "POST",
            body: user1
        });
        assert.equal(res1.status, 201);
        assert.ok(res1.data.message);

        // Register user2 as well
        const res2 = await request("/api/auth/register", {
            method: "POST",
            body: user2
        });
        assert.equal(res2.status, 201);
    });

    test("POST /api/auth/register - reject duplicate email", async () => {
        const res = await request("/api/auth/register", {
            method: "POST",
            body: user1
        });
        assert.equal(res.status, 400);
        assert.ok(res.data.message.includes("exists"));
    });

    test("POST /api/auth/login - wrong password returns 401", async () => {
        const res = await request("/api/auth/login", {
            method: "POST",
            body: { email: user1.email, password: "WrongPassword!" }
        });
        assert.equal(res.status, 401);
    });

    test("POST /api/auth/login - success returns token and user", async () => {
        const res1 = await request("/api/auth/login", {
            method: "POST",
            body: { email: user1.email, password: user1.password }
        });
        assert.equal(res1.status, 200);
        assert.ok(res1.data.token);
        assert.ok(res1.data.user);
        assert.equal(res1.data.user.email, user1.email.toLowerCase());
        token1 = res1.data.token;
        user1Id = res1.data.user._id;

        const res2 = await request("/api/auth/login", {
            method: "POST",
            body: { email: user2.email, password: user2.password }
        });
        token2 = res2.data.token;
        user2Id = res2.data.user._id;
    });

    test("GET /api/auth/me - requires auth and returns current user", async () => {
        const unauth = await request("/api/auth/me");
        assert.equal(unauth.status, 401);

        const auth = await request("/api/auth/me", {
            headers: { Authorization: `Bearer ${token1}` }
        });
        assert.equal(auth.status, 200);
        assert.equal(auth.data.user.email, user1.email.toLowerCase());
    });

    test("PUT & PATCH /api/auth/profile - update user profile", async () => {
        // PUT update
        const resPut = await request("/api/auth/profile", {
            method: "PUT",
            headers: { Authorization: `Bearer ${token1}` },
            body: {
                bio: "Fullstack enthusiast",
                skills: ["React", "Node.js", "MongoDB"],
                github: "https://github.com/alice"
            }
        });
        assert.equal(resPut.status, 200);
        assert.equal(resPut.data.user.bio, "Fullstack enthusiast");
        assert.deepEqual(resPut.data.user.skills, ["React", "Node.js", "MongoDB"]);

        // PATCH update
        const resPatch = await request("/api/auth/profile", {
            method: "PATCH",
            headers: { Authorization: `Bearer ${token1}` },
            body: {
                bio: "Updated fullstack builder"
            }
        });
        assert.equal(resPatch.status, 200);
        assert.equal(resPatch.data.user.bio, "Updated fullstack builder");

        // Invalid field rejected
        const resInvalid = await request("/api/auth/profile", {
            method: "PUT",
            headers: { Authorization: `Bearer ${token1}` },
            body: { hackerField: "bad" }
        });
        assert.equal(resInvalid.status, 400);
    });

    test("GET /api/auth/profile/:userId - get public profile", async () => {
        const res = await request(`/api/auth/profile/${user1Id}`);
        assert.equal(res.status, 200);
        assert.equal(res.data.user.name, user1.name);

        const resNotFound = await request(`/api/auth/profile/507f1f77bcf86cd799439011`);
        assert.equal(resNotFound.status, 404);

        const resInvalidId = await request(`/api/auth/profile/invalid-id`);
        assert.equal(resInvalidId.status, 404);
    });

    // 3. Project Flow Tests
    test("POST /api/projects - create project via POST / and POST /create", async () => {
        // Unauthorized
        const unauth = await request("/api/projects", {
            method: "POST",
            body: { title: "No Auth Project" }
        });
        assert.equal(unauth.status, 401);

        // Validation error: missing fields
        const invalid = await request("/api/projects", {
            method: "POST",
            headers: { Authorization: `Bearer ${token1}` },
            body: { title: "Hi" }
        });
        assert.equal(invalid.status, 400);

        // Success via POST /api/projects
        const res = await request("/api/projects", {
            method: "POST",
            headers: { Authorization: `Bearer ${token1}` },
            body: {
                title: "BuildBridge Platform",
                description: "An open collaboration space for builders and engineers.",
                category: "Web Development",
                requiredSkills: ["React", "Node.js"],
                techStack: ["MERN", "Express"],
                teamSize: 3,
                recruitmentStatus: "open",
                resources: [
                    { title: "Design Docs", url: "https://example.com/docs" }
                ]
            }
        });
        assert.equal(res.status, 201);
        assert.ok(res.data._id || res.data.project?._id);
        testProjectId = res.data._id || res.data.project._id;

        // Verify POST /api/projects/create also works
        const resCreate = await request("/api/projects/create", {
            method: "POST",
            headers: { Authorization: `Bearer ${token1}` },
            body: {
                title: "Second Sample Project",
                description: "Testing create endpoint route alias",
                category: "AI",
                requiredSkills: ["Python"],
                teamSize: 2,
                recruitmentStatus: "open"
            }
        });
        assert.equal(resCreate.status, 201);
        // Clean up second project immediately
        await Project.findByIdAndDelete(resCreate.data._id || resCreate.data.project._id);
    });

    test("GET /api/projects - list, filter, and safe regex search", async () => {
        // Normal list
        const resList = await request("/api/projects");
        assert.equal(resList.status, 200);
        assert.ok(Array.isArray(resList.data));
        assert.ok(resList.data.length >= 1);

        // Safe regex search with special characters (must NOT crash MongoDB)
        const resRegex = await request("/api/projects?search=C%2B%2B");
        assert.equal(resRegex.status, 200);

        const resRegexParenthesis = await request("/api/projects?search=(platform)");
        assert.equal(resRegexParenthesis.status, 200);

        // Search matching title
        const resSearch = await request("/api/projects?search=BuildBridge");
        assert.equal(resSearch.status, 200);
        assert.ok(resSearch.data.some(p => p._id === testProjectId));

        // Filter by category
        const resCategory = await request("/api/projects?category=Web%20Development");
        assert.equal(resCategory.status, 200);
        assert.ok(resCategory.data.some(p => p._id === testProjectId));
    });

    test("GET /api/projects/:projectId - get project details with populated owner", async () => {
        const res = await request(`/api/projects/${testProjectId}`);
        assert.equal(res.status, 200);
        assert.equal(res.data.title, "BuildBridge Platform");
        assert.ok(res.data.owner);
        assert.equal(res.data.owner.name, user1.name);

        // Invalid ID returns 404
        const resInvalid = await request("/api/projects/invalid-project-id");
        assert.equal(resInvalid.status, 404);
    });

    test("PUT & PATCH /api/projects/:projectId - update project with permission checks", async () => {
        // Non-owner (user2) attempts update -> 403
        const forbidden = await request(`/api/projects/${testProjectId}`, {
            method: "PUT",
            headers: { Authorization: `Bearer ${token2}` },
            body: { title: "Hijacked Title" }
        });
        assert.equal(forbidden.status, 403);

        // Owner (user1) updates via PUT
        const resPut = await request(`/api/projects/${testProjectId}`, {
            method: "PUT",
            headers: { Authorization: `Bearer ${token1}` },
            body: { description: "Updated collaboration description for team." }
        });
        assert.equal(resPut.status, 200);

        // Owner updates via PATCH
        const resPatch = await request(`/api/projects/${testProjectId}`, {
            method: "PATCH",
            headers: { Authorization: `Bearer ${token1}` },
            body: { teamSize: 4 }
        });
        assert.equal(resPatch.status, 200);
    });

    // 4. Application Flow Tests
    test("POST /api/applications - application submission & permissions", async () => {
        // Owner cannot apply to own project -> 400
        const ownerApply = await request("/api/applications", {
            method: "POST",
            headers: { Authorization: `Bearer ${token1}` },
            body: { projectId: testProjectId }
        });
        assert.equal(ownerApply.status, 400);

        // User2 applies to project -> 201
        const applyRes = await request("/api/applications", {
            method: "POST",
            headers: { Authorization: `Bearer ${token2}` },
            body: { projectId: testProjectId }
        });
        assert.equal(applyRes.status, 201);
        testApplicationId = applyRes.data._id || applyRes.data.application?._id;
        assert.ok(testApplicationId);

        // User2 duplicate application -> 400
        const duplicateApply = await request("/api/applications", {
            method: "POST",
            headers: { Authorization: `Bearer ${token2}` },
            body: { projectId: testProjectId }
        });
        assert.equal(duplicateApply.status, 400);
    });

    test("GET /api/applications/:projectId - owner checks applications", async () => {
        // Non-owner cannot view applications
        const nonOwner = await request(`/api/applications/${testProjectId}`, {
            headers: { Authorization: `Bearer ${token2}` }
        });
        assert.equal(nonOwner.status, 403);

        // Owner can view applications
        const owner = await request(`/api/applications/${testProjectId}`, {
            headers: { Authorization: `Bearer ${token1}` }
        });
        assert.equal(owner.status, 200);
        assert.ok(Array.isArray(owner.data));
        assert.equal(owner.data.length, 1);
        assert.equal(owner.data[0].applicant.name, user2.name);
    });

    test("PATCH /api/applications/:applicationId - accept application & add member", async () => {
        // Non-owner cannot accept
        const nonOwner = await request(`/api/applications/${testApplicationId}`, {
            method: "PATCH",
            headers: { Authorization: `Bearer ${token2}` },
            body: { status: "accepted" }
        });
        assert.equal(nonOwner.status, 403);

        // Owner accepts
        const acceptRes = await request(`/api/applications/${testApplicationId}`, {
            method: "PATCH",
            headers: { Authorization: `Bearer ${token1}` },
            body: { status: "accepted" }
        });
        assert.equal(acceptRes.status, 200);

        // Verify user2 is now in project teamMembers
        const projRes = await request(`/api/projects/${testProjectId}`);
        assert.ok(projRes.data.teamMembers.some(m => String(m._id || m) === user2Id));

        // Now user2 applying again should be rejected as already member
        const applyAgain = await request("/api/applications", {
            method: "POST",
            headers: { Authorization: `Bearer ${token2}` },
            body: { projectId: testProjectId }
        });
        assert.equal(applyAgain.status, 400);
    });

    // 5. Tasks Flow Tests
    test("POST /api/tasks/:projectId - create task & assign permissions", async () => {
        // Non-member (or random user without owner permissions)
        // Only owner can create tasks per route
        const nonOwner = await request(`/api/tasks/${testProjectId}`, {
            method: "POST",
            headers: { Authorization: `Bearer ${token2}` },
            body: { title: "Hacker Task" }
        });
        assert.equal(nonOwner.status, 403);

        // Owner can create and assign to team member user2
        const task1Res = await request(`/api/tasks/${testProjectId}`, {
            method: "POST",
            headers: { Authorization: `Bearer ${token1}` },
            body: {
                title: "Setup API Documentation",
                description: "Write comprehensive OpenAPI specs",
                assignedTo: user2Id,
                status: "todo"
            }
        });
        assert.equal(task1Res.status, 201);
        testTaskId = task1Res.data.task?._id || task1Res.data._id;
        assert.ok(testTaskId);

        // Owner can also self-assign task!
        const task2Res = await request(`/api/tasks/${testProjectId}`, {
            method: "POST",
            headers: { Authorization: `Bearer ${token1}` },
            body: {
                title: "Architecture Review",
                assignedTo: user1Id,
                status: "in-progress"
            }
        });
        assert.equal(task2Res.status, 201);
        assert.ok(task2Res.data.task);

        // Assigning to an outside non-member user should fail
        const nonMemberId = new mongoose.Types.ObjectId().toString();
        const invalidAssign = await request(`/api/tasks/${testProjectId}`, {
            method: "POST",
            headers: { Authorization: `Bearer ${token1}` },
            body: {
                title: "Invalid Assignment Task",
                assignedTo: nonMemberId
            }
        });
        assert.equal(invalidAssign.status, 400);
    });

    test("GET /api/tasks/:projectId & kanban - retrieve tasks with populated assignees", async () => {
        const res = await request(`/api/tasks/${testProjectId}`, {
            headers: { Authorization: `Bearer ${token2}` }
        });
        assert.equal(res.status, 200);
        assert.ok(res.data.tasks.length >= 2);
        assert.ok(res.data.tasks[0].assignedTo?.name);

        const kanban = await request(`/api/tasks/${testProjectId}/kanban`, {
            headers: { Authorization: `Bearer ${token2}` }
        });
        assert.equal(kanban.status, 200);
        assert.ok(kanban.data.kanban.todo);
        assert.ok(kanban.data.kanban.inProgress);
    });

    test("PATCH /api/tasks/:projectId/:taskId - update task & role constraints", async () => {
        // Team member (user2) can update task status from todo to in-progress
        const updateStatus = await request(`/api/tasks/${testProjectId}/${testTaskId}`, {
            method: "PATCH",
            headers: { Authorization: `Bearer ${token2}` },
            body: { status: "in-progress" }
        });
        assert.equal(updateStatus.status, 200);
        assert.equal(updateStatus.data.task.status, "in-progress");

        // Rule: In-progress tasks CANNOT go back to todo
        const moveBackToTodo = await request(`/api/tasks/${testProjectId}/${testTaskId}`, {
            method: "PATCH",
            headers: { Authorization: `Bearer ${token2}` },
            body: { status: "todo" }
        });
        assert.equal(moveBackToTodo.status, 400);
        assert.ok(moveBackToTodo.data.message.includes("cannot be moved back to To Do"));

        // Team member cannot update task title (owner only)
        const forbiddenField = await request(`/api/tasks/${testProjectId}/${testTaskId}`, {
            method: "PATCH",
            headers: { Authorization: `Bearer ${token2}` },
            body: { title: "Renamed by member" }
        });
        assert.equal(forbiddenField.status, 403);

        // Owner can update title and unassign task
        const ownerUpdate = await request(`/api/tasks/${testProjectId}/${testTaskId}`, {
            method: "PATCH",
            headers: { Authorization: `Bearer ${token1}` },
            body: { title: "Setup API Docs (Complete)", assignedTo: "" }
        });
        assert.equal(ownerUpdate.status, 200);
        assert.equal(ownerUpdate.data.task.title, "Setup API Docs (Complete)");
        assert.equal(ownerUpdate.data.task.assignedTo, null);

        // Move to completed
        const completeTask = await request(`/api/tasks/${testProjectId}/${testTaskId}`, {
            method: "PATCH",
            headers: { Authorization: `Bearer ${token2}` },
            body: { status: "completed" }
        });
        assert.equal(completeTask.status, 200);
        assert.equal(completeTask.data.task.status, "completed");

        // Rule: Completed tasks are final and cannot change status
        const reopenTask = await request(`/api/tasks/${testProjectId}/${testTaskId}`, {
            method: "PATCH",
            headers: { Authorization: `Bearer ${token1}` },
            body: { status: "in-progress" }
        });
        assert.equal(reopenTask.status, 400);
        assert.ok(reopenTask.data.message.includes("Completed tasks are final"));
    });

    // 6. Comments Flow Tests
    test("POST & GET /api/comments/:projectId - comment collaboration", async () => {
        // Member user2 posts a comment
        const postRes = await request(`/api/comments/${testProjectId}`, {
            method: "POST",
            headers: { Authorization: `Bearer ${token2}` },
            body: { content: "Great progress on the sprint!" }
        });
        assert.equal(postRes.status, 201);
        testCommentId = postRes.data.comment?._id || postRes.data._id;
        assert.ok(testCommentId);

        // Get comments
        const getRes = await request(`/api/comments/${testProjectId}`, {
            headers: { Authorization: `Bearer ${token1}` }
        });
        assert.equal(getRes.status, 200);
        assert.ok(getRes.data.comments.length >= 1);
        assert.equal(getRes.data.comments[0].author.name, user2.name);
    });

    test("PATCH & DELETE /api/comments/:commentId - comment author permissions", async () => {
        // Non-author user1 cannot edit comment
        const forbiddenEdit = await request(`/api/comments/${testCommentId}`, {
            method: "PATCH",
            headers: { Authorization: `Bearer ${token1}` },
            body: { content: "Tampered comment" }
        });
        assert.equal(forbiddenEdit.status, 403);

        // Author user2 can edit comment
        const editRes = await request(`/api/comments/${testCommentId}`, {
            method: "PATCH",
            headers: { Authorization: `Bearer ${token2}` },
            body: { content: "Great progress on the sprint! Updated note." }
        });
        assert.equal(editRes.status, 200);

        // Author user2 can delete comment
        const deleteRes = await request(`/api/comments/${testCommentId}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token2}` }
        });
        assert.equal(deleteRes.status, 200);
    });

    // 7. Dashboard Flow Tests
    test("GET /api/dashboard - retrieve comprehensive dashboard overview", async () => {
        const res = await request("/api/dashboard", {
            headers: { Authorization: `Bearer ${token1}` }
        });
        assert.equal(res.status, 200);
        assert.ok(res.data.dashboard.user);
        assert.ok(res.data.dashboard.projects.owned);
        assert.ok(res.data.dashboard.projects.memberOf);
        assert.ok(res.data.dashboard.tasks);
        assert.ok(res.data.dashboard.recentActivity);
    });

    // 8. Progress and Workspace
    test("GET /api/projects/:projectId/workspace & progress", async () => {
        const ws = await request(`/api/projects/${testProjectId}/workspace`, {
            headers: { Authorization: `Bearer ${token1}` }
        });
        assert.equal(ws.status, 200);
        assert.equal(ws.data.title, "BuildBridge Platform");

        const progress = await request(`/api/projects/${testProjectId}/progress`, {
            headers: { Authorization: `Bearer ${token1}` }
        });
        assert.equal(progress.status, 200);
        assert.ok(progress.data.totalTasks >= 1);
    });

    // 9. Leave, Remove Member, and Delete Project
    test("DELETE /api/projects/:projectId/members/me & :userId", async () => {
        // User2 leaves project
        const leaveRes = await request(`/api/projects/${testProjectId}/members/me`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token2}` }
        });
        assert.equal(leaveRes.status, 200);

        // Verify user2 no longer in team members
        const projRes = await request(`/api/projects/${testProjectId}`);
        assert.equal(projRes.data.teamMembers.length, 0);

        // Delete project by owner
        const deleteProj = await request(`/api/projects/${testProjectId}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token1}` }
        });
        assert.equal(deleteProj.status, 200);

        // Verify cascade deletion of tasks
        const tasksRemaining = await Task.find({ project: testProjectId });
        assert.equal(tasksRemaining.length, 0);

        testProjectId = "";
    });
});

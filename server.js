/** @format */

import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, "public")));

const myToken = process.env.API_CLOUD_FLARE_TOKEN;
const myAccount = process.env.API_CLOUD_FLARE_ACCOUNT;
const model = process.env.API_CLOUD_FLARE_MODEL;

const CODEX_KEYWORDS = [
	"html",
	"css",
	"javascript",
	"js",
	"bootstrap",
	"flexbox",
	"grid",
	"node",
	"express",
	"api",
	"backend",
	"frontend",
	"database",
	"react",
	"component",
	"state",
	"props",
	"algorithm",
	"logic",
	"debug",
	"function",
	"array",
	"loop",
	"git",
	"deploy",
	"capstone",
	"project",
	"assignment",
	"codex",
];

const BLOCKED_TOPICS = [
	"politics",
	"religion",
	"dating",
	"relationship",
	"sex",
	"medical",
	"health",
	"diagnosis",
	"money",
	"crypto",
	"stocks",
	"movie",
	"celebrity",
	"sports",
];

function isCodexQuestion(text) {
	const lower = text.toLowerCase();
	if (BLOCKED_TOPICS.some((t) => lower.includes(t))) return false;
	return CODEX_KEYWORDS.some((k) => lower.includes(k));
}

const SYSTEM_PROMPT = `
You are a Codex Academy Assistant.

Rules:
- Teach before solving.
- Do not complete graded assignments outright.
- Explain how to think, not just what to do.
- Keep explanations short, clear, and practical.
- Use examples only when they add clarity.
- Break problems into steps when the student is stuck.
`;

app.post("/chat", async (req, res) => {
	const { message } = req.body;

	if (!isCodexQuestion(message)) {
		return res.json({
			reply:
				"I'm a Codex Academy Assistant. I only answer questions related to Codex coursework and programming.",
		});
	}

	const messages = [
		{ role: "system", content: SYSTEM_PROMPT },
		{ role: "user", content: message },
	];

	try {
		const response = await fetch(
			`https://api.cloudflare.com/client/v4/accounts/${myAccount}/ai/run/${model}`,
			{
				method: "POST",
				headers: {
					Authorization: `Bearer ${myToken}`,
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ messages }),
			},
		);

		const result = await response.json();
		let reply;
		if (typeof result?.result === "string") {
			reply = result.result;
		} else if (result?.result?.response) {
			reply = result.result.response;
		} else if (result?.result?.output) {
			reply = result.result.output;
		} else {
			reply = "No response received.";
		}

		res.json({ reply });
	} catch (err) {
		console.error("Cloudflare error:", err);
		res.json({
			reply: "Error contacting Codex Assistant.",
		});
	}
});

app.listen(3000, () => {
	console.log("CodexBot server running at http://localhost:3000");
});

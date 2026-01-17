/** @format */

export default {
	async fetch(request, env) {
		if (request.method !== "POST") {
			return new Response("Not allowed", { status: 405 });
		}

		const { message } = await request.json();

		const CODEX_KEYWORDS = [
			"html",
			"css",
			"javascript",
			"js",
			"bootstrap",
			"flexbox",
			"grid",
			"box model",
			"responsive",
			"ui",
			"ux",
			"dom",
			"node",
			"express",
			"api",
			"backend",
			"frontend",
			"server",
			"endpoint",
			"database",
			"sql",
			"nosql",
			"react",
			"context",
			"hook",
			"component",
			"state",
			"props",
			"algorithm",
			"logic",
			"debug",
			"function",
			"variable",
			"array",
			"loop",
			"condition",
			"object",
			"git",
			"github",
			"version control",
			"deploy",
			"deployment",
			"capstone",
			"project",
			"assignment",
			"bootcamp",
			"codex",
		];

		const BLOCKED_TOPICS = [
			"politics",
			"election",
			"president",
			"religion",
			"god",
			"dating",
			"relationship",
			"sex",
			"medical",
			"health",
			"diagnosis",
			"money",
			"invest",
			"crypto",
			"stocks",
			"movie",
			"tv show",
			"celebrity",
			"sports",
			"game",
		];

		function isCodexQuestion(message) {
			const text = message.toLowerCase();

			if (BLOCKED_TOPICS.some((t) => text.includes(t))) {
				return false;
			}

			return CODEX_KEYWORDS.some((k) => text.includes(k));
		}

		if (!isCodexQuestion(message)) {
			return new Response(
				JSON.stringify({
					reply:
						"I'm a Codex Academy Assistant. I only answer questions related to Codex coursework, software development, and programming concepts.",
				}),
				{ headers: { "Content-Type": "application/json" } },
			);
		}

		return new Response(
			JSON.stringify({
				reply: "Codex-related input detected. AI response would go here.",
			}),
			{ headers: { "Content-Type": "application/json" } },
		);
	},
};

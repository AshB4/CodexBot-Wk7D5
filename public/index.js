/** @format */

async function send() {
	const btn = document.getElementById("sendBtn");
	btn.disabled = true;

	try {
		const message = document.getElementById("input").value;

		const res = await fetch("/chat", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ message }),
		});

		const data = await res.json();
		document.getElementById("output").textContent = data.reply;
	} catch {
		document.getElementById("output").textContent = "Error contacting server.";
	} finally {
		btn.disabled = false;
	}
}

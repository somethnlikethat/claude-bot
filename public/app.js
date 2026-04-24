async function send() {
    const input = document.getElementById("input");
    const chat = document.getElementById("chat");

    const message = input.value;
    if (!message) return;

    chat.innerHTML += `<div><b>You:</b> ${message}</div>`;
    input.value = "";

    const res = await fetch("/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message })
    });

    const data = await res.json();

    chat.innerHTML += `<div><b>Claude:</b> ${data.reply}</div>`;
}
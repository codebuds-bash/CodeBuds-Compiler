async function executeCode() {
    const code = document.getElementById("code").value;
    const language = document.getElementById("language").value;

    let languageMap = {
        "python": "python3",
        "javascript": "nodejs",
        "c_cpp": "cpp14"
    };

    try {
        const response = await fetch("http://localhost:3000/execute", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                code: code,
                language: languageMap[language]
            })
        });

        const result = await response.json();
        document.getElementById("output").innerText = result.output || result.error || "No output.";
    } catch (error) {
        console.error("Error:", error);
        document.getElementById("output").innerText = "An error occurred while executing code.";
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("nameForm");
    const nameInput = document.getElementById("nameInput");
    const nameList = document.getElementById("nameList");

    // Function to fetch and update the list of names
    async function fetchNames() {
        try {
            const response = await fetch("http://localhost:3000/names");
            if (!response.ok) {
                throw new Error("Failed to fetch names");
            }
            const names = await response.json();
            updateNameList(names);
        } catch (error) {
            console.error("Error fetching names:", error);
        }
    }

    // Function to update the list of names in the UI
    function updateNameList(names) {
        nameList.innerHTML = "";
        names.forEach((name) => {
            const listItem = document.createElement("li");
            listItem.textContent = name;
            nameList.appendChild(listItem);
        });
    }

    // Handle form submission
    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const name = nameInput.value.trim();
        if (name === "") {
            alert("Please enter a name.");
            return;
        }

        try {
            const response = await fetch("http://localhost:3000/submit", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ name }),
            });

            if (!response.ok) {
                throw new Error("Failed to submit name");
            }

            nameInput.value = "";
            fetchNames(); // Refresh list after successful submission
        } catch (error) {
            console.error("Error submitting name:", error);
        }
    });

    // Initial fetch of names on page load
    fetchNames();
});

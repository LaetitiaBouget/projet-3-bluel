const formulaireLogin = document.querySelector("#login-form");
formulaireLogin.addEventListener("submit", async function (event) {
    event.preventDefault();

    const user = {
        email: event.target.querySelector("[name=email]").value,
        password: event.target.querySelector("[name=password]").value,
    };

    const response = await fetch('http://localhost:5678/api/users/login', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
    })

    const result = await response.json();

    if (response.ok) {
        sessionStorage.setItem('authToken', result.token);
        window.location.href = "./index.html";
    }else{
        alert("Erreur dans l’identifiant ou le mot de passe");
    }
});




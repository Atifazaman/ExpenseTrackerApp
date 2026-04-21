const emailInput=document.getElementById("email")
const passwordInput=document.getElementById("password")
const loginBtn=document.getElementById("loginBtn")
const loginForm=document.getElementById("loginForm")
const message=document.getElementById("message")
const Base_Url="http://localhost:3000/user"


async function checkUser(obj){
    try {
        const response=await axios.post(`${Base_Url}/login`,obj)
       console.log(response.data.message);
       message.classList.add("loginMessage")
       message.innerText = response.data.message || "login successful";
        localStorage.setItem("loggedIn", "true");
        window.location.href = "expenseTracker.html";
       loginForm.reset(); 
    } catch (error) {
        const errMsg = error.response?.data?.message || "Something went wrong";
        message.classList.add("errorMessage");
        message.innerText = errMsg;
    }
}

loginForm.addEventListener("submit",(e)=>{
    e.preventDefault()
    const obj={
        email:emailInput.value,
        password:passwordInput.value
    }
    checkUser(obj)
})
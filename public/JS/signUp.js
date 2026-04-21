const nameInput=document.getElementById("name")
const emailInput=document.getElementById("email")
const passwordInput=document.getElementById("password")
const signUpBtn=document.getElementById("signUpBtn")
const signUpForm=document.getElementById("signUpForm")
const message=document.getElementById("message")
const Base_Url="http://localhost:3000/user"


async function addUser(obj){
    try {
        const response=await axios.post(`${Base_Url}/signup`,obj)
       console.log(response.data.message);
       message.classList.add("signUpMessage")
       message.innerText = response.data.message || "Sign Up successful";
       signUpForm.reset(); 
    } catch (error) {
        const errMsg = error.response?.data?.message || "Something went wrong";
        message.classList.add("errorMessage");
        message.innerText = errMsg;
    }
}

signUpForm.addEventListener("submit",(e)=>{
    e.preventDefault()

    const obj={
        name:nameInput.value,
        email:emailInput.value,
        password:passwordInput.value
    }

    addUser(obj)
})

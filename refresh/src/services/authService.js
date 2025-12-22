import api from "./apiservice"

const authService={
    //RegisterUser
    register:async(authData)=>{
        const response=await api.post("/auth/register",authData)
        return response.data
    },
    login:async(loginData) =>{
        const response=await api.post("/auth/login",loginData)
        return response.data
    }
}
export default authService
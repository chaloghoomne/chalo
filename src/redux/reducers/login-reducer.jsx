

export const LoginReducer = (state={isLogin:false},actions)=>{
const {type,payload} = actions
switch (type) {
    case "LOGIN":
        return {
         isLogin:payload
        }
       

    default:return state
     
}
}
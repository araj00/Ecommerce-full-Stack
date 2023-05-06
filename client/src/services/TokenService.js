export const getLocalAccessToken = () => {
    const accessToken = JSON.parse(localStorage.getItem("accessToken"))
    return accessToken
}

export const setLocalAccessToken = (token) => {
    localStorage.setItem('accessToken',JSON.stringify(token))
}

export const removeLocalAccessToken = () => {
    localStorage.removeItem('accessToken')
}
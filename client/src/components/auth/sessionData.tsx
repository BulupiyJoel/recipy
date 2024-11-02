const sessionData = JSON.parse(sessionStorage.getItem("sessionData") ?? "{}");
const sessionValues = sessionData.userdata ?? ""

const { id , username } = sessionValues

export { id, username };
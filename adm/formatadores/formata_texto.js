module.exports = (string) => {

    if (!string)
        return "`Sem texto`"

    string = string.replaceAll("&quot;", "\"")
    string = string.replaceAll("&#039;", "'")
    string = string.replaceAll("&amp;", "&")
    string = string.replaceAll("&#34;", "\"")
    string = string.replaceAll("&#39;", "'")
    string = string.replaceAll("<br />", "")
    string = string.replaceAll("<strong>", "")
    string = string.replaceAll("</strong>", "")

    if (string.length > 2000)
        string = `${string.slice(0, 1995)}...`

    return string
}
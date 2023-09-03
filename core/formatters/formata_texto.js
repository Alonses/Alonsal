module.exports = (string) => {

    if (!string)
        return "`Sem texto`"

    string = string.replaceAll("&quot;", "\"")
    string = string.replaceAll("&#039;", "'")
    string = string.replaceAll("&amp;", "&")
    string = string.replaceAll("&#34;", "\"")
    string = string.replaceAll("&#39;", "'")
    string = string.replaceAll("<br />", " ")
    string = string.replaceAll("<strong>", "").replaceAll("</strong>", "")
    string = string.replaceAll("<em>", "").replaceAll("</em>", "")
    string = string.replace("<p class=\"truncate-text\">", "")
    string = string.replace("</span><span                            class=\"disclose-hide\"                            id=\"about-me-expanded\"                        >", "")
    string = string.replace("<span                            class=\"truncated-text\"                        >", "")

    string = string.trim()

    if (string.length > 2000)
        string = `${string.slice(0, 1995)}...`

    return string
}
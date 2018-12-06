// @ts-check

"use strict"

/**
 * @param {"question" | "article"} type 
 * @param {*} data 
 */
function createItemDiv(type, data) {
    var itemDiv = document.createElement("div")
    itemDiv.classList.add("aw-item")

    var avatarA = document.createElement("a")
    avatarA.classList.add("aw-user-name", "hidden-xs")
    var avatarImg = document.createElement("img")
    avatarImg.src = data.authorAvatar || "/static/common/avatar-mid-img.png"
    avatarA.appendChild(avatarImg)

    var contentDiv = document.createElement("div")
    contentDiv.classList.add("aw-question-content")

    var titleH4 = document.createElement("h4")
    var titleA = document.createElement("a")
    titleA.href = "/" + type + "/" + data.id
    titleA.text = data.title
    titleH4.appendChild(titleA)

    var contentP = document.createElement("p")

    var tagA = document.createElement("a")
    tagA.classList.add("aw-question-tags")
    tagA.text = "默认分类"

    var userNameA = document.createElement("a")
    userNameA.classList.add("aw-user-name")

    var contentSpan = document.createElement("span")

    if (type == "question") {
        if (data.lastAnswer) {
            userNameA.text = data.lastAnswer.authorUserName || "匿名用户"
            contentSpan.innerText = " 回复了问题 • " + data.concerns + " 人关注 • " + data.answersCount + " 个回复 • " + data.views + " 次浏览 • " + data.lastAnswer.publishDate
        } else {  // 没有回答
            userNameA.text = data.authorUserName || "匿名用户"
            contentSpan.innerText = " 发起了问题  • " + data.concerns + " 人关注 • " + data.answersCount + " 个回复 • " + data.views + " 次浏览 • " + data.publishDate
        }
    } else {
        userNameA.text = data.authorUserName || "匿名用户"
        contentSpan.innerText = " 发表了文章 • " + data.voters + " 人点赞 • " + data.commentsCount + " 条评论 • " + data.publishDate
    }

    contentP.append(tagA, " • ", userNameA, contentSpan)

    contentDiv.append(titleH4, contentP)

    itemDiv.append(avatarA, contentDiv)

    return itemDiv
}

function getDate(x) {
    var d = x.lastAnswer ? x.lastAnswer.publishDate : x.publishDate
    return new Date(d)
}

function sortByDate(x) {
    return x.sort(function (a, b) {
        return getDate(b).getTime() - getDate(a).getTime()
    })
}

var pathname = top.location.pathname
var el = document.querySelector(".aw-common-list")

var categories = document.querySelectorAll(".category li")

/** @type {HTMLDivElement[]} */
var items = []

/** @type {Object[]} */
var articles = sortByDate(top.articles)
var questions = sortByDate(top.questions)

if (pathname.indexOf("/article/") == 0) {
    var pathTitle = document.querySelector("#page-title")
    pathTitle.lastChild.replaceWith(" 文章")

    categories[0].classList.toggle("active")
    categories[2].classList.toggle("active")

    items = articles.map(function (x) {
        return createItemDiv("article", x)
    })

} else {

    items = questions.map(function (x) {
        return createItemDiv("question", x)
    })

}

el.append.apply(el, items)

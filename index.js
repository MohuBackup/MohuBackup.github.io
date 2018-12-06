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

/**
 * @param {number} currentPage 
 */
function createPaginationUL(currentPage, maxPage) {
    /**
     * @param {number} p 
     * @param {string=} text 
     */
    function createPaginationLI(p, text) {
        var LI = document.createElement("li")

        var A = document.createElement("a")
        A.href = "#page_" + p
        A.text = text || String(p)

        LI.appendChild(A)

        return LI
    }

    var firstPageLI = createPaginationLI(1, "<<")
    var previousPageLI = createPaginationLI(currentPage - 1, "<")
    var nextPageLI = createPaginationLI(currentPage + 1, ">")
    var lastPageLI = createPaginationLI(maxPage, ">>")

    var paginationLIs = []
    for (var i = currentPage - 3; i <= currentPage + 3; i++) {
        if (i > 0 && i <= maxPage) {
            var LI = createPaginationLI(i)
            if (i == currentPage) {
                LI.classList.add("active")
            }
            paginationLIs.push(LI)
        }
    }

    var paginationUL = document.createElement("ul")
    paginationUL.classList.add("pagination", "pull-right")

    if (currentPage > 4) /*      */paginationUL.appendChild(firstPageLI)
    if (currentPage > 1) /*      */paginationUL.appendChild(previousPageLI)
    /*                           */paginationUL.append.apply(paginationUL, paginationLIs)
    if (currentPage < maxPage)/* */paginationUL.appendChild(nextPageLI)
    if (currentPage < maxPage - 3) paginationUL.appendChild(lastPageLI)

    return paginationUL
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

var main = function () {
    var pageHashMatch = location.hash.match(/#page_(\d+)/)
    var page = pageHashMatch ? +pageHashMatch[1] : 1
    var n = 10

    var output = items.slice(n * (page - 1), n * page)

    var newEl = document.createElement("div")
    newEl.classList.add("aw-common-list")
    newEl.append.apply(newEl, output)
    var el = document.querySelector(".aw-common-list")
    el.replaceWith(newEl)

    var paginationEl = document.querySelector(".pagination")
    var newPaginationEl = createPaginationUL(page, Math.ceil(items.length / n))
    paginationEl.replaceWith(newPaginationEl)
}

top.onhashchange = main
main()

// 도서 검색_책 이름으로 검색
function searchByTitle() {
    bookTitle = $('#book-title').val()
    console.log(bookTitle)
    $('#searchedBookList').html("")
    $.ajax({
        method: "GET",
        url: "https://dapi.kakao.com/v3/search/book?target=title",
        data: {
            'query': bookTitle
        },
        headers: {
            Authorization: "KakaoAK "+ API_KEY
        }
    })
        .done(function (msg) {
            for (let i = 0; i < msg.documents.length; i++) {
                let temp = `<tr id="book-${i}">
                                    <td>${msg.documents[i].title}</td>
                                    <td>${msg.documents[i].authors}</td>
                                    <td>${msg.documents[i].publisher}</td>
                                    <td><img src="${msg.documents[i].thumbnail}"/></td>
                                </tr>`
                $('#searchedBookList').append(temp)
                $(`#book-${i}`).on('click', function () {

                    select_book(msg.documents[i])
                })
            }
        });
}

function searchByAuthor() {
    bookTitle = $('#book-author').val()
    $('#searchedBookList').html("")
    $.ajax({
        method: "GET",
        url: "https://dapi.kakao.com/v3/search/book?target=authors",
        data: {
            'query': bookTitle
        },
        headers: {
            Authorization: "KakaoAK "+config.apiKey
        }
    })
        .done(function (msg) {
            console.log(msg)
            console.log(msg.documents)
            for (let i = 0; i < msg.documents.length; i++) {
                let temp = `<tr>
                                <td>${msg.documents[i].title}</td>
                                <td>${msg.documents[i].authors}</td>
                                <td>${msg.documents[i].publisher}</td>
                                <td><img src="${msg.documents[i].thumbnail}"/></td>
                            </tr>`
                $('#searchedBookList').append(temp)
            }
        });
}


// 검색 결과로 나온 책 중 원하는 책 선택
function select_book(book) {
    console.log("post select_book")
    console.log(book)
    $('#search').modal('hide');     // 모달 창 hide

    $('#book-title_form').val(book['title']);
    $('#book-thumbnail-form').val(book['thumbnail']);
    $('#book-author_form').val(book['authors']);
    $('#book-publisher_form').val(book['publisher']);
}

// 리뷰 작성
function writeReview() {
    let title = $('#book-title_form').val();
    let thumbnail = $('#book-thumbnail-form').val();
    let author = $('#book-author_form').val();
    let publisher = $('#book-publisher_form').val();
    let review = $('#book-review_form').val();

    console.log(title, thumbnail, author, publisher, review)
    if (title === '') {
        alert('title을 입력해주세요.')
        $('#book-title').focus()
    } else if (author === '') {
        alert('author를 입력해주세요.')
        $('#book-author').focus()
    } else if (publisher === '') {
        alert('review를 입력해주세요.')
        $('#book-publisher').focus()
    } else if (review === '') {
        alert('review를 입력해주세요.')
        $('#book-review').focus()
    }
    console.log("ffffffff")
    $.ajax({
        type: "POST",
        url: "/write",
        data: {
            'title': title,
            'thumbnail': thumbnail,
            'author': author,
            'publisher': publisher,
            'review': review
        },
        success: function(response) {
            console.log(response)
            if (response["result"] === "success") {
                console.log("success")
                location.href="/"
            }
        }
    })
}


function getReviews() {
    $.ajax({
        type: 'GET',
        url: '/review',
        data: {},
        success: function (response) {
            if (response['result'] == 'success') {

                let reviewList = response['reviews'];

                for (let i = 0; i < reviewList.length; i++) {
                    let review_ = reviewList[i]

                    let title = review_['title']
                    let author = review_['author']
                    let publisher = review_['publisher']
                    let review = review_['review']
                    let thumbnail = review_['thumbnail']

                    if (i%3 == 0) {
                        console.log(title)
                        let temp = `<div class="row row-cols-1 row-cols-md-2 review-row" id="row${i/3}">
                                    </div>`
                        $('#reviews-container').append(temp)
                        console.log(temp)
                    }

                    let temp = `<div class="col-12 col-sm-6 col-md-4" onclick="location.href='/viewReview?title=${title}'" style="cursor:pointer;">
                                    <div class="card">
                                        <img src="${thumbnail}" class="card-img-top" width="100%" height="100%">
                                        <div class="card-body">
                                            <h5 class="card-title" style="text-align: center">${title}</h5>
<!--                                            <p class="card-text">${review}</p>-->
                                        </div>
                                    </div>
                                </div>`


                    // let temp = `<div class="col-12 col-sm-6 col-md-4" onclick="postTitle('${title}')">
                    //                 <div class="card">
                    //                     <img src="${thumbnail}" class="card-img-top" width="100%" height="100%">
                    //                     <div class="card-body">
                    //                         <h5 class="card-title">${title}</h5>
                    //                         <p class="card-text">${review}</p>
                    //                     </div>
                    //                 </div>
                    //             </div>`


                    console.log(parseInt(i/3))
                    console.log(temp)
                    $('#row'+parseInt(i/3)).append(temp)
                }
            }
        }
    });
}

// 책 제목 전송
function postTitle(title) {
    console.log("postTitle")
    console.log(title)

     $.ajax({
        type: "POST",
        url: "/viewReview",
        data: {
            'title': title
        },
        success: function (response) {
            if (response["result"] === "success") {
                console.log("success")
            }
        }
    })

}

function deleteReview(){
    console.log("deleteReview")
    title = $('#book-title_form').val()
    console.log(title)
    $.ajax({
        type: "POST",
        url: "/deleteReview",
        data: {
            'title': title
        },
        success: function (response) {
            if (response["result"] === "success") {
                console.log("success")
                // window.href="http://localhost:5000/"
                alert("리뷰가 삭제되었습니다.")
                location.href="/"
            }
        }
    })
}



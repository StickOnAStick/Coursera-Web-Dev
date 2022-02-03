$(function(){
    $("#navbarToggle").blur(function(event){
        var screenWidth = window.innerWidth;
        if(screenWidth < 768){
            $("#collapsable-nav").collapse('hide');
        }
    });
});

( function (global) {
    var dc = {};
    var homeHtml = "snippets/home-snippet.html";
    var allCategoriesUrl = "http://davids-restaurant.herokuapp.com/categories.json";
    var categoriesTitleHtml = "snippets/categories-title-snippet.html";
    var categoryHtml = "snippets/category-snippet.html";

    //Convinence function for inserting the innerHTML for 'select'
    var insertHtml = function (selector, html){
        var targetElem = document.querySelector(selector);
        targetElem.innerHTML = html;
    };


    //Show loading icon inside element identified by 'selector'
    var showLoading = function (selector){
        var html = "<div class='text-center'>";
        html += "<img src='images/Ajax-loader.gif'></div>";
        insertHtml(selector, html);
    };

    //return substitute of '{{propName}}'
    //with propValue in given 'string'
    var insertProperty = function(string, propName, propValue){
        var propToReplace = "{{" + propName + "}}";
        string = string.replace(new RegExp(propToReplace, "g"), propValue);
        return string;
    }

    //on page load (before images or css)
    document.addEventListener("DOMContentLoaded", function(event){

        //on first load, show home view
        showLoading("#main-content");
        $ajaxUtils.sendGetRequest(
            homeHtml, function(responseText){
                document.querySelector("#main-content").innerHTML = responseText;
            },
        false);
    });

    //Load the menu categories view
    dc.loadMenuCategories = function(){
        showLoading("#main-content");
        $ajaxUtils.sendGetRequest( allCategoriesUrl, buildAndShowCategoriesHTML);
    };

    //Builds HTML for the categories page based on the data from the server
    function buildAndShowCategoriesHTML(categories){

        //Load title snippet of categories page
        $ajaxUtils.sendGetRequest( categoriesTitleHtml, function (categoriesTitleHtml) {
            //retrive single category snippet
            $ajaxUtils.sendGetRequest( categoryHtml, function(categoryHtml){
                var category = buildAndShowCategoriesHTML(categories, categoriesTitleHtml, categoryHtml);
                insertHtml("#main-content", categoriesViewHtml);
            },
            false);
        },
        false);
    }

    //Using categories data and snippets Html
    //build cateogires view html to be inserted into the page
    function buildCategoriesViewHtml(cateogires, categoriesTitleHtml, categoriesViewHtml){
        var finalHtml = categoriesTitleHtml;
        finalHtml += "<section class='row'>"

        //loop over categories
        for(var i = 0; i < categories.length; i++){
            //insert categories
            var html = categoryHtml;
            var name = "" + categories[i].name;
            var short_name = categories[i].short_name;

            html = insertProperty(html, "name", name);
            html = insertProperty(html, "short_name", short_name);
            finalHtml += html;
        }

        finalHtml += "</section>";
        return finalHtml;
    }


    global.$dc = dc;

})(window);

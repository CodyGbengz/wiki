$(document).ready(function(){
  var searchTerm ="";
  var wikiUrl = "https://en.wikipedia.org/w/api.php?callback=?";
  var thumbnail = 100;
  var articleNum = 10;
  var x;
  var timer;
   $('#searchterm').keyup(function(e){
     searchTerm = $('#searchterm').val();
     if(x){
       x.abort();
     }
     clearTimeout(timer);
     timer = setTimeout(function(){
       $('#searchresults').empty();
       x= getArticle(searchTerm,articleNum);},1000);
  });
   $('.clear').hide();
   $('#searchterm').keypress(function(e){
     $('.clear').show();
  });
  $('.clear').click(function(e){
    $('#searchresults').empty();
    $('#searchterm').val('');
    $('.clear').hide();
 })
   function getArticle(searchTerm,articleNum){
     var parameters = {
       search: searchTerm,
       action: "opensearch",
       list: "search",
       format: "json",
       limit: articleNum
     };
     $.getJSON(wikiUrl,parameters)
     .done(function(data,textStatus,jqXHR){
       console.log(data);
      $.each(data,function(i){
        var article  = {};
        article.title = data[1][i];
        article.intro = data[2][i];
        article.link = data[3][i];
        var parameters = {
          action:"query",
          prop:"pageimages",
          piprop:"thumbnail",
          pithumbsize: thumbnail,
          titles: article.title,
          format:"json",
          pilimit:1
        };
        $.getJSON(wikiUrl,parameters)
        .done(function(data, textStatus, jqXHR){
          console.log(data);
          var key = Object.keys(data.query.pages);
          if (data.query.pages[key[0]].thumbnail !== undefined){
            article.pic = data.query.pages[key[0]].thumbnail.source;
          }
          else{
            article.pic = null;
          }
          articleItem(article);
        })
        .fail(function(jqXHR,textStatus,errorThrown){
          console.log(errorThrown.toString());
        })
      });
    })
     .fail(function(jqXHR,textStatus,errorThrown){
       console.log(errorThrown.toString());
     })
   };
   function articleItem(article){
     var html = "";
     html += "<div class='media' href='" + article.link + "' target='_blank'><li class='media list-group-item'>";
     html += "<div class='media-left'>";
     html += "<div class='imagebox'>";
     if(article.pic !== null) {
       html += "<img class='imageicon' src='" + article.pic +"'>";
     }else{
     	html += "<img class='imageicon' src='/Users/Mart/Desktop/Projekts/fcc/Wiki/images/download.jpg'>";
     }
     html += "</div>";
     html += "</div>";
     html += "<div class='media-body'>";
     html += "<div class='media-text'>";
     html += "<h4 class='media-heading'>" + article.title + "</h4>";
     html += "<p>" + article.intro + "</p>";
     html += "</div>";
     html += "</div>";
     html += "</li></a>";
     
     $('#searchresults').append(html);
     $('#searchresults').slideDown('slow');
     $('.imageicon').css({
       width: 100,
       height: 100
     });
   }
})

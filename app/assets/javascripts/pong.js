function btnClick()
{
  $.ajax({
    type: "GET",
    url: "/pong/hi",
    dataType: 'json',
    success: function(data) {alert("Hello from the server at " + data);},
    error: function(jqXHR, textStatus, errorThrown) {console.log(textStatus, errorThrown);}
  });
}

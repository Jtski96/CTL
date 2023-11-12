// To Do
// - make results persistent for domain
// - make styles override site's

window.download_csv = function (filename, text) {
  var element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}

window.get_matches = function (first_run=1) {
  var matches = []
  if ((localStorage.regex==undefined) | (localStorage.regex_group==undefined) | (localStorage.header==undefined) | (localStorage.delimiter==undefined) | (localStorage.eol==undefined)) {
    localStorage.regex = "@\\w+@\\w+(\\.\\w+)+";
    localStorage.regex_groups = "0";
    localStorage.header = "Account address,Show boosts\\n";
    localStorage.delimiter = ","
    localStorage.eol = ",true\\n"
    localStorage.results = ""
  } 
  try {
    localStorage.regex = document.getElementById(`regex`).value 
    localStorage.regex_groups = document.getElementById(`regex_groups`).value 
    localStorage.header = document.getElementById(`header`).value 
    localStorage.delimiter = document.getElementById(`delimiter`).value 
    localStorage.eol = document.getElementById(`eol`).value 
    document.getElementById(`regexspacer`).remove();
    document.getElementById(`regexfind`).remove();
  }
  catch(err){console.log("new")}
  this_regex = RegExp(localStorage.regex,"g")
  group_set = "["
  groups = localStorage.regex_groups.split(",");
  for (x in groups){
    if (x!=0){
      group_set += ",";	
    }
    group_set += "arr["+groups[x]+"]";
  }
  group_set += "]"
  //console.log(group_set);
  handles = [...document.body.innerHTML.matchAll(this_regex)].map(arr => eval(group_set).join(localStorage.delimiter));
  //console.log(handles);
  handles = [...new Set(handles)];
  if (first_run!=1) {
    if (handles.length>0){
      results += handles.join(localStorage.eol)+ localStorage.eol;
    }
  } else {
    if (handles.length>0){
      results = localStorage.header;
      results += handles.join(localStorage.eol) + localStorage.eol;
    } else {
      results = ""
    }
  }
  //console.log(results);
  var newline = String.fromCharCode(13, 10);
  count =  (results.split(localStorage.eol).length - 1)
  results = results.replaceAll('\\n', newline);
  if (count==0){
    //count = 0;
    results = "no matches found";
  }
  document.body.innerHTML += "<div id='regexspacer'<br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br></div><div id='regexfind' style='position:fixed;z-index:100000;bottom:0px;width:100%;text-align:center;background:#eee;padding:5px 15px 25px 15px;border-top: solid 1px black;'><p style='padding:8px 0px 3px 0px;'>Pattern<!--&nbsp;&nbsp;<select><option>Free Form</option></select>--><select id='regexDropdown'>
  <option value='\\w+@\\w+(\\.\\w+)+'>Email</option>
  <option value='\\(?(\\d{3})(\\) |\\.|\\-)?\\d{3}(\\.|\\-)\\d{4}'>Phone Number</option>
  <option value='\\d+\\s[Uu]\\.?[Ss]\\.?[Cc]\\.?(?:A|A.)?(?:\\s(?:§|Section))? (?:§\\s)?\\d+'>USC References</option>
  <option value='\\b([A-Z][A-Za-z&.,\\s-]+) ([vV]\\.?) ([A-Za-z&.,\\s-]+), (\\d+) (F\\.2d|F\\.3d|F\\.4th|U\\.S\\.) (\\d+(,\\s?\\d+)?) \\(((1st|2nd|2d|3d|3rd|[4-9]th) [Cc]ir\\. \\d+|\\d+)\\)'>Case Names</option>
  <option value='([A-Z][a-z'-]+)(?: ([A-Z][a-z'-]+|([A-Z]\\.?)|)( ([A-Z][a-z]+(?:-[A-Z][a-z'-]+)?))'>Names</option>
  <option value='/\\b(?:(\\d{1,2})[-\\/]?(\\d{1,2})[-\\/]?(\\d{2}|\\d{4})|(\\d{1,2})(?:st|nd|rd|th)?\\s*(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember))\\s*\\,?\\s*(\\d{4}|\\d{2})|(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember))\\s*(\\d{1,2})(?:st|nd|rd|th)?\\s*\\,?\\s*(\\d{4}|\\d{2}))\\b/gm'>Dates</option>
</select>Group(s)<input id='regex_groups' value='"+localStorage.regex_groups+"' style='width:100%'/>Headers<input id='header' value='"+localStorage.header+"' style='width:100%'/>Delimiter<input id='delimiter' value='"+localStorage.delimiter+"' style='width:100%'/>End of Line<input id='eol' value='"+localStorage.eol+"' style='width:100%'/></p><p style='padding:8px 0px'>"+count+" items found | <a href='' target='_blank'>stand-alone</a> | <a href='javascript:document.getElementById(`regexfind`).remove();document.getElementById(`regexspacer`).remove();localStorage.clear();get_matches(1);'>reset</a> | <a href='javascript:get_matches(1);'>run</a> | <a href='javascript:get_matches(0);'>run &amp; add</a> | <a href='javascript:download_csv(`mastodon_handles.csv`,document.getElementById(`masto_ids`).value);'>download csv</a> | <a href='javascript:document.getElementById(`regexfind`).remove();document.getElementById(`regexspacer`).remove();'>close</a></p><textarea id='masto_ids' style='width:100%;height:180px;background:white;'>"+results+"</textarea></div>";

}

get_matches(1);

var http = require('http'),
    url = require('url'),
    fs  = require('fs'),
    path = require('path');
     

// 传输文件
function getFile(localPath,mimeType,res){
    fs.readFile(localPath,function(err,contents){
        if(!err){
            res.writeHead(200,{
                'Content-Type' : mimeType,
                'Content-length' : contents.length
            
            });
            res.end(contents);
        }else{
            res.writeHead(500);
            res.end();
        }
    
    });
}

http.createServer(function(req,res){
    var urlPath = url.parse(req.url).pathname;
    var fileName = path.basename(req.url) || 'index.html',
         suffix  = path.extname(fileName).substring(1),
         dir = path.dirname(req.url).substring(1),
         localPath = __dirname + '\\';
    

    if(suffix === 'js'){
        localPath += (dir ? dir + '\\' : '') + fileName;
        fs.exists(localPath,function(exists){
            if(exists){
                getFile(localPath,'js',res);
            }else{
                res.writeHead(404);
                res.end();
            }
            
        });
        
    }else{
        if(urlPath === '/index'){
        res.writeHead(200,{'Content-Type':'text/html;charset=utf-8'});
        var html = '<!DOCTYPE html>'
                    +'<head>'
                    +'<script src="http://libs.baidu.com/jquery/1.9.0/jquery.js"></script>'
                    
                    +'<script type="text/javascript" src="http://www.a.com:8088/index?callback=getFollowers"></script>'
                    +'<script>'
                    +'$(function(){'
                    +  ''
                    +  '$("#getFo").click(function(){'
                    +'    $.ajax({'
                    +            'url:"http://www.b.com:9099/followers.json",'
                    +       'type:"get",'
                    +       'success:function(json){'
                    +       '    alert(json.users[0].name);'
                    +       '}'
                    +        '});'
                    +     ''
                    +    '});'
                    +'});'
                    +'</script>'
                    +'</head>'
                    +'<body>'
                    +'<h1>hello i am server b </h1>'
                    +'<input id="getFo" type="button" value="获取我的粉丝"/>'
                    +'</body>'
                    +'</html>';
        res.write(html);
        res.end();


    }else if(urlPath === '/followers.json'){
        res.writeHead(200,{'Content-Type':'application/json;charset=utf-8'});
        res.writeHead({'Access-Control-Allow-Origin':*});

        var followers = {
                                "users" : [
                                    {"id" : "1","name" : "小王"},
                                    {"id" : "2","name" : "小李"}
                                  ]
                                };
        var fjson = JSON.stringify(followers);
        res.end(fjson);
    }else{
        res.writeHead(404,{'Content-Type':'text/html;charset=utf-8'});
        res.end('page not found');
    }
    
}
    
    
}).listen(9099);
console.log('Listening app B at 9099...');
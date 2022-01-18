const express = require("express");
const bodyParser = require('body-parser');
const posts = require('./posts');
const app = express();
app.use(bodyParser.json());
posts.load();

//Get      /posts/(list posts)
app.get('/posts' , (req , res)=>
{
    let postsList = posts.list();
    res.send(postsList);
})

//Get      /posts/:post_id (Get a post)
app.get('/posts/:post_id' , (req , res)=>
{
    let post_id = req.params.post_id;
    let post = posts.get(post_id);
    if(!post)
    {
        res.status(404).send("Post not Found!");
    }
    else
    {
        res.send(post);
    }
})
//Post     /posts (Post a post)
app.post('/posts' , async (req , res)=>
{
    let title = req.body.title;
    let description = req.body.description;
   let post =  await posts.add({title,description});
    res.send(post);

})
//DELETE   /posts/:post_id (delete a post)
app.delete('/posts/:post_id' , (req , res)=>
{
    let post_id = req.params.post_id;
    let post = posts.get(post_id);
    if(!post)
    {
        res.status(404).send("Post not Found!");
    }
    else
    {
        res.send(posts.delete(post_id));
    }
})
//PUT      /posts/:post_id (edit a post)
app.put('/posts/:post_id' , (req,res)=>
{
    let post_id = req.params.post_id;
    let post = posts.get(post_id);
    if(!post)
    {
        res.status(404).send("Post not Found!");
    }
    else
    {
         posts.update(post_id,req.body.title , req.body.description);
         res.send(post);
    }
})
//GET      /posts/:post_id/comments/ (list comments in a post)
app.get('/posts/:post_id/comments' , (req ,res)=>
{
    let post_id = req.params.post_id;
    let post = posts.get(post_id);
    if(!post)
    {
        res.status(404).send("Post not Found!");
    }
    else
    {
        res.send(posts.listComments(post_id))
    }
})
//GET      /posts/:post_id/comments/:comment_id (get a comment from post)
app.get('/posts/:post_id/comments/:comment_id' , (req ,res)=>
{
    let post_id = req.params.post_id;
    let comment_id = req.params.comment_id;
    let post = posts.get(post_id);
    if(!post)
    {
        res.status(404).send("Post not Found!");
    }
    else
    {
        var comment = posts.getComment(post_id , comment_id);
        if(!comment)
        {   
            res.status(404).send("Comment not Found!");
        }
        else
            res.send(comment);
    }
})
//POST     /posts/:post_id/comments (add comment to post)
app.post('/posts/:post_id/comments' , (req ,res)=>
{
    let post_id = req.params.post_id;
    let post = posts.get(post_id);
    if(!post)
    {
        res.status(404).send("Post not Found!");
    }
    else
    {
        var comment = posts.addComment(post_id,req.body.comment);
        res.send(comment);
    }
})
//DELETE   /posts/:post_id/comments/:comment_id (delete comment from post)
app.delete('/posts/:post_id/comments/:comment_id' , (req ,res)=>
{
    let post_id = req.params.post_id;
    let comment_id = req.params.comment_id;
    let post = posts.get(post_id);
    if(!post)
    {
        res.status(404).send("Post not Found!");
    }
    else
    {
        var comment = posts.getComment(post_id , comment_id);
        if(!comment)
        {   
            res.status(404).send("Comment not Found!");
        }
        else
            if(!posts.deleteComment(post_id,comment_id))
                res.send("Delete Successful")
    }
})
//PUT   /posts/:post_id/comments/:comment_id (update comment)
app.put("/posts/:post_id/comments/:comment_id" , (req ,res)=>
{
    let post_id = req.params.post_id;
    let comment_id = req.params.comment_id;
    let post = posts.get(post_id);
    if(!post)
    {
        res.status(404).send("Post not Found!");
    }
    else
    {
        var comment = posts.getComment(post_id , comment_id);
        if(!comment)
        {   
            res.status(404).send("Comment not Found!");
        }
        else
        {
            res.send(posts.updateComment(post_id,comment_id,req.body.comment));;
        }
    }
})

app.listen(80 , (err)=>
{
    if(!err)
        console.log("Server is Up and listening on port 80");
    else
        console.log(err);
})

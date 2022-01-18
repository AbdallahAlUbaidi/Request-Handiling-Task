const { json } = require("body-parser");
const fs = require("fs");

class posts
{
    #idCounter = 1;
    #posts = [];
    load()
    {
        fs.readFile("./Data/Data.json" , (err,_data)=>
        {
            if(!err)
            {
                if(_data.length != 0)
                {
                    console.log("Data Read successfully");
                    this.#posts =  JSON.parse(_data).data;
                    this.#idCounter =  JSON.parse(_data).counter;
                }
                else
                    console.log("No Data is Stored");
            }
            else
                console.log(err)
        })
    }
    save()
    {
        
        let arr = {data:this.#posts , counter:this.#idCounter };

        fs.writeFile("./Data/Data.json" , `${JSON.stringify(arr)}` , (err)=>
        {
            if(!err)
                console.log("Data Saved Successfully");
            else
                console.log(err);
        })
    }
    list()
    {
        return this.#posts;
    }
    add({title , description})
    {
        var addedPost = {
            id:this.#idCounter,
            title,
            description,
            comments:[],
            commentCounter: 0
        };
        this.#idCounter++;
        this.#posts.push(addedPost);
        this.save()
        return addedPost;
    }
    get(id)
    {
        return this.#posts.find((post)=>post.id == id);
    }

    delete(id)
    {
        var post = this.get(id);
        if(!post)
            return undefined;
        this.#posts = this.#posts.filter((post)=> post.id != id)
        this.save()
        return "Delete successful";
    }

    update(id , title , description)
    {
        var post = this.get(id)
        if(!post)
            return undefined;
        post.title = title || post.title;
        post.description = description || post.description;
        this.save()
        return post;
    }

    addComment(postId , comment)
    {
        var post = this.get(postId)
        if(!post)
            return undefined;
        else
        {
            var newComment = {id: (post.commentCounter++ + 1) , comment};
            if(newComment)
                post.comments.push(newComment);
            this.save()
            return newComment;
        }
    }
    getComment(postId , commentId)
    {
        var post = this.get(postId)
        return post.comments.find((comment)=>comment.id == commentId)
        
    }
    deleteComment(postId , commentId)
    {
        var post = this.get(postId);
        var comment = this.getComment(postId , commentId);
        if(!comment)
            return undefined;
        post.comments = post.comments.filter((comment)=> comment.id != commentId);
        this.save()
    }
    updateComment(postId , commentId , commentText)
    {
        var post = this.get(postId);
        var comment = this.getComment(postId , commentId);
        if(!comment)
            return undefined;
        comment.comment = commentText || comment.comment ;
        this.save()
        return comment;
    }
    listComments(postId)
    {
        var post = this.get(postId);
        return post.comments;
    }
}

module.exports = new posts();
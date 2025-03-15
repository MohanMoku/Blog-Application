import mongoose from "mongoose";

const PostSchema = new mongoose.Schema(
    {
        userId: {
            type: String,
            required: true
        },
        content:{
            type:String,
            required:true
        },
        title:{
            type:String,
            required:true,
            unique:true
        },
        image :{
            type:String,
            default: 'https://blog.apastyle.org/.a/6a01157041f4e3970b01b7c82eb758970b-320wi'
        },
        category:{
            type:String,
            default:'Uncategorized'
        },
        slug:{
            type:String,
            required:true,
            unique:true
        }

    },{timestamps:true}
)

const Post = mongoose.model('Post', PostSchema)

export default Post;

const mongoose=require("mongoose");


mongoose.connect("mongodb://localhost:27017/todoDB", { useNewUrlParser: true, useUnifiedTopology: true });


const todoSchema=new mongoose.Schema({ 
    name:String,
    status: String
});
const Todo = mongoose.model("Todo",todoSchema);








// node app.js add "walk dog"
                    
const data=process.argv.slice(2);//data ={add, walk dog}
if(data.length===0)
{
    usage();
}

if(data[0]==="add")
{
    
    console.info("new todo added");
    var todo = new Todo({
            name:data[1],
            status: "incomplete"
    });

               todo.save(function(err,result){
               if(err){
                 console.log(err);
                }
               else{
                mongoose.connection.close();
                }
               });
}
    
       
    
else if (data[0]==="ls")
{
    Todo.find(function (err, todos) {
        if (err) {
            console.log(err);
        } else {

            mongoose.connection.close();
            var i=1;
            todos.forEach(function (todo) {
                if(todo.status==="incomplete")
                {console.log("["+ i++ +"]"+" "+todo.name);}
                
            });
        }
    });
}

else if(data[0]==="done")
{
    var index=data[1]-1;
    Todo.find({status:"incomplete"},function(err,todos){
            if(err)
            {
                console.log(err);
            }
            else
            {
               var field=todos[index].name;

               Todo.updateOne({name:field},{status:"completed"},function(err){
                    if(err)
                    {
                        console.log(err);
                    }
                    else
                    {
                        console.log("marked todo #"+data[1]+" as done");
                        mongoose.connection.close();
                    }
               });
            }
    });

    }


  

    else if(data[0]==="help")
    {
      usage();
    }

    else if(data[0]==="report")
    {
        var date=new Date();

        var pending=0;
        var completed=0;
        Todo.find({status:"incomplete"},function(err,todos){
           pending=todos.length;
        Todo.find({status:"completed"},function(err,todos){
    
              completed=todos.length;
              
              console.log(date.getDate()+"/"+(date.getMonth()+1)+"/"+date.getFullYear()+"   "+
              "pending: "+pending+" completed: "+completed);
              mongoose.connection.close();
         });
        });


    
    }

function usage(){
       console.log("Usage:-");
       console.log("$ todo add 'todo item'\t\t"+"# Add new todo");
       console.log("$ todo ls \t\t\t"+"# Show all todos");
       console.log("$ todo done NUMBER \t\t"+"# Mark todo done");
       console.log("$ todo report \t\t\t"+"# Show statistics");
       mongoose.connection.close();
}

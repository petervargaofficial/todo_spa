$(function(){
    // var testObj = {msg: "Hello, world!"};
    // var myTest = $(HandlebarsTemplates.test(testObj));
    // console.log(myTest)
    //   $("#testCon").append(myTest);

    var App = {}; 
    window.App = App;

    var todos = [];
    
    App.models = todos;

    App.findModel = function(id){
        var foundModel;
       $(this.models).each( function(index, item){
            if(item.id === id){
                foundModel = item
            }
       });
       return foundModel;
    };

    // We might say App.setTarget("#todos"), 
    //      which is where we will append todos
    App.setTarget = function(sel){
        this.targetSel = sel;
        this.$target = $(sel);
        return this;
    }; 
    // We might say App.setTemplate("todo"), 
    //      which is what we will use to make todos
    App.setTemplate = function(name){
      this.template = HandlebarsTemplates[name];
      return this;  
    };
    
    // Chaining example:
    // App.setTarget("#todos").setTemplate("todo")
    
    // We might say App.setTargetTemplate("#todos", "todo")
    App.setTargetTemplate = function(sel, name){
        this.setTarget(sel).setTemplate(name);
        return this;
    };
    
    App.render = function(item){
       this.$el = $(this.template(item));
       this.$target.append(this.$el);
       return this;
    };

    App.renderAllModels = function(){
        var _this = this;
        $(this.models).each(function(index, todoModel){
            _this.render(todoModel);
        });
        return this;
    };

    App.saveModel = function(model, callback){
        // DO SOME STUFF HERE TO PERSIST DATA
        callback(model);
    };

    App.updateItem = function(model, callback){
        // DO SOMETHING HERE
        callback(model);  
    };

    App.doThis = function(func){
    	func.apply(App);
        return this;
    };

    App.urls = {
        index : { path: '/todos.json', method : 'get'},
        create : { path : '/todos.json', method : 'post'}
    };

    App.getItems = function(callback) {
        $.ajax({
            url : this.urls.index.path,
            type : this.urls.index.method
        }).done(callback);
    }

    App.setTargetTemplate("#todos", "todo")
    .renderAllModels().doThis(function(){
        var _this = this;
        // Add new models from a form
        $("#addTodo").on("submit",function(event){
            event.preventDefault();
            var newTodo = {completed: false};
            newTodo.title = $("#todo_title").val();
            
            _this.saveModel(newTodo, function(data){
                _this.models.push(data);
                _this.render(data);
            });
        });
        
    });


    App.doThis(function(){
        var _this = this;
        
        //CHECKBOX EVENTHANDLER
        $("#todos").on("click", ".todo", function(event){
           console.log(this.dataset); 
           var id = Number(this.dataset.id);
           if(event.target.name === "completed"){
                console.log("FIRED!!!")
               var view = this;
               var todo = _this.findModel(id);
               todo.completed = !todo.completed;
               _this.updateItem(todo, function(data){
                    $(view).toggleClass("done-true");
               });
           }
        });
    });

    App.doThis(function() {
        var _this = this;

        _this.getItems(function(responseData) {
            _this.models = _this.models.concat(responseData);
            _this.renderAllModels();
        });
    });

});

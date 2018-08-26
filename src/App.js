import React, { Component } from 'react';
import logo from './logo.svg';
import loading from './loading.gif';
import './App.css';
import ListItem from './ListItem';
import axios from 'axios';

class App extends Component {

  constructor() {
    super();
    this.state = {
      newToDo: '',
      editing: false,
      editingindex: null,
      notification: null,
      todos: [],
      loading: true
    };

    this.apiUrl = 'https://5b82de4f5118040014cd6c3a.mockapi.io';

    this.handleChange = this.handleChange.bind(this);
    this.addTodo = this.addTodo.bind(this);
    this.deleteToDo = this.deleteToDo.bind(this);
    this.updateToDo = this.updateToDo.bind(this);
    //this.generateTodoId = this.generateTodoId.bind(this);
    this.editToDo = this.editToDo.bind(this);
    this.alert = this.alert.bind(this);
  }

  
  async componentDidMount() {
   const response = await axios.get(`${this.apiUrl}/todos`);
   console.log('Response: ', response);
   
   setTimeout(() => {
     this.setState({
       todos: response.data,
       loading: false
     });
   }, 1000);
  }
  


  handleChange(event) {
    //console.log(event.target.name, event.target.value);
    this.setState({
      newToDo: event.target.value
    });

  }

  // generateTodoId() {
  //   const lastTodo = this.state.todos[this.state.todos.length -1];
    
  //   if(lastTodo) {
  //     return lastTodo.id + 1;
  //   } else {
  //     return 1;
  //   }
  // }

  async addTodo(event) {
    //before mock api
    // const newTodo = {
    //   name: this.state.newToDo,
    //   //id: this.state.todos[this.state.todos.length - 1].id + 1
    //   id: this.generateTodoId()
    // };

    const modTodos = this.state.todos;

    const postResponse = await axios.post(`${this.apiUrl}/todos`, {
      name: this.state.newToDo
    });

    modTodos.push(postResponse.data); 

    // this.setState({
    //   todos: modTodos,
    //   newToDo: ''
    // });

    this.alert('Todo Added Successfully');

    

    console.log('postResponse: ', postResponse);
  }

  async deleteToDo(index) {

    console.log('Delete Index: ', index);

    this.state.loading = true;
    
    const refToDo = this.state.todos;

    const todo = refToDo[index];
    await axios.delete(`${this.apiUrl}/todos/${todo.id}`);
    
    delete refToDo[index];

    this.setState({
      todos:refToDo,
      loading: false
    });

    this.alert('Todo Deleted Successfully');

    console.log('after delete: ', this.state);
  }

  editToDo(index) {
    const todo = this.state.todos[index];
    this.setState({
      editing: true,
      newToDo: todo.name,
      editingIndex: index
    });
  }

  async updateToDo(index) {
    const todo = this.state.todos[this.state.editingIndex];

    const response = await axios.put(`${this.apiUrl}/todos/${todo.id}`, {
      name: this.state.newToDo
    });

    console.log('Update Response: ', response);
    
    //todo.name = this.state.newToDo; 
     
    const todos = this.state.todos;
    todos[this.state.editingIndex] = response.data;
    this.setState({
      todos, 
      editing: false, 
      editingIndex: null,
      newToDo: ''
    });

    this.alert('Todo Updted Successfully');
  }

  alert(notification) {
    this.setState({notification});

    setTimeout(() => {
      this.setState({notification: null});
    }, 2000);
  }

  
  render() {
   
    console.log('newTodo: ', this.state.newToDo);

    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">CRUD REACT</h1>
        </header>
        <div className="container">
          {
            this.state.notification &&
            <div className="mt-4 alert alert-success">
              <p className="text-center">{this.state.notification}</p>
            </div>
          }
          <input 
            name="todo"
            type="text" 
            className="my-4 form-control" 
            placeholder="Add a new todo"
            onChange={this.handleChange}
            value={this.state.newToDo}
          />

          <button
            disabled={this.state.newToDo.length < 1}
            onClick={!this.state.editing ? this.addTodo : this.updateToDo}
            className="mb-4 btn-success form-control">
            {this.state.editing ? 'Update Todo' : 'Add Todo'}
          </button>

          {
            this.state.loading && 
            <img src={loading} alt="loading img" />
          }

          {
            (!this.state.editing || this.state.loading) && 
            <ul className="list-group">
              {this.state.todos.map((item, index) => {
                return <ListItem 
                  key = {item.id}
                  item = {item}
                  editToDo = {() => {this.editToDo(index)}}
                  deleteToDo = {() => {this.deleteToDo(index)}}
                />
              })}
            </ul>
          }
        </div>
      </div>
    );
  }
}

export default App;
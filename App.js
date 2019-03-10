/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 * @lint-ignore-every XPLATJSCOPYRIGHT1
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, StatusBar, ListView} from 'react-native';
import {List, ListItem, Icon, Header, Content, Item, Container, Input, Form, Button, Label} from 'native-base';


import * as firebase from 'firebase';

  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyCv-d7IubS16ED6Jn8AGAbj3SsfFGPw62I",
    authDomain: "fir-whatodo.firebaseapp.com",
    databaseURL: "https://fir-whatodo.firebaseio.com",
    projectId: "fir-whatodo",
    storageBucket: "fir-whatodo.appspot.com",
    messagingSenderId: "533755678150"
  };
  firebase.initializeApp(config);



var data = []

export default class App extends Component<Props> {

  constructor(props) {
    super(props)

    this.ds = new ListView.DataSource({rowHasChanged: (r1,r2) => r1 !== r2 })

    this.state = {
      listViewData: data,
      newContact: ""
    }

  }

  componentDidMount() {

    var that = this;

    firebase.database().ref('/contacts').on('child_added', function(data){

    var newData = [...that.state.listViewData]
    newData.push(data)
    that.setState({listViewData: newData})

    })

  }


  addRow(data){
    var key = firebase.database().ref('/contacts').push().key
    firebase.database().ref('/contacts').child(key).set({name:data})
  }

  async deleteRow(secId,rowId,rowMap,data){
  await firebase.database().ref('contacts/' + data.key).set(null)

  rowMap[`${secId}${rowId}`].props.closeRow();
  var newData = [...this.state.listViewData];
  newData.splice(rowId,1)
  this.setState({listViewData: newData});

  }

  showInformation(){

  }


  render() {
    return (
      

      <Container style={styles.container}>

        <View style={styles.header}>
        <Text style={styles.headerText}> WhaToDo </Text>
        </View>


        <Header style={{marginTop:StatusBar.currentHeight}}>
          <Content>
           <Item>
             <Input
                onChangeText = {(newContact) => this.setState({ newContact })} 
                placeholder="Add name"/>
              <Button onPress={()=>this.addRow(this.state.newContact)} >
                <Icon name="add"/>
              </Button>

           </Item>
         </Content>
        </Header>
       
        <Content>
          <List
          enableEmptySections
             dataSource={this.ds.cloneWithRows(this.state.listViewData)}
             renderRow={data=>
                 <ListItem>
                    <Text>{data.val().name}</Text>
                 </ListItem>
                 }
                
                 renderLeftHiddenRow={data=>
                  <Button full onPress={()=> this.addRow(data)}>
                  <Icon name = "information-circle"/>
                  </Button>

                 }
                
                 renderRightHiddenRow={(data,secId,rowId,rowMap)=>
                  <Button full danger onPress={()=>this.deleteRow(secId,rowId,rowMap,data)}>
                  <Icon name = "trash"/>
                  </Button>

                 }

                  leftOpenValue={-75}
                  rightOpenValue={-75}


           />

        </Content>

      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  headerText: {
    fontSize: 25,
    color: 'black',
    padding: 26,

  },
  header: {
    backgroundColor: '#ffb6c1',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 10,
    borderBottomColor: '#ddd',
    margin: 2,
  },
});

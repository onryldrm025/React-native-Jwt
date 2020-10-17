import React, {Component} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  FlatList,
  TextInput,
  Button,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      name: '',
      pass: '',
      kayıtdurum: '',
      token: '',
    };
  }

  componentDidMount() {
    this.getdata();
    const url = 'http://localhost:4545/users';
    fetch(url)
      .then((response) => response.json())
      .then((respnseJson) => {
        this.setState({
          data: respnseJson,
        });
      })
      .catch((eror) => {
        console.log('Bağlantı Hatası');
      });
  }
  renderItem = ({item}) => {
    return (
      <View style={{flexDirection: 'row'}}>
        <Text>{item.ad}</Text>
        <Text> {item.id}</Text>
      </View>
    );
  };

  handles = () => {
    fetch('http://localhost:4545/kaydol', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: this.state.name,
        email: this.state.pass,
        meslek: 'qqq',
      }),
    })
      .then((response) => response.json())
      .then((respnseJson) => {
        console.log(respnseJson.token);
        this.saveToken(respnseJson.token).then((r) =>
          console.log('Kaydedildi'),
        );
      })
      .catch((eror) => {
        this.setState({kayıtdurum: 'Kayıt Başarısız'});
      });
  };

  saveToken = async (token) => {
    console.log('Token kaydedildi', token);
    await AsyncStorage.setItem('token', token);
  };
  getdata = async () => {
    const value = await AsyncStorage.getItem('token');
    this.setState({token: value});
  };

  render() {
    return (
      <View>
        <Text>{this.state.token}</Text>
        <TextInput
          placeholder={'email'}
          style={{borderWidth: 1, height: 35, width: '35%'}}
          onChangeText={(text) => this.setState({name: text})}
        />
        <TextInput
          placeholder={'Pass'}
          style={{borderWidth: 1, height: 35, width: '35%', marginTop: 15}}
          onChangeText={(text) => this.setState({pass: text})}
        />
        <Text>{this.state.name}</Text>
        <Text>{this.state.pass}</Text>
        <Text>{this.state.kayıtdurum}</Text>
        <Button title={'bas'} onPress={this.handles} />
        <FlatList
          automaticallyAdjustContentInsets={false}
          data={this.state.data}
          renderItem={this.renderItem}
          keyExtractor={(item) => item.id.toString()}
        />
      </View>
    );
  }
}
export default App;

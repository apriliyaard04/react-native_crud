import React, { Component } from 'react';
import { Alert, Platform, StyleSheet, View, StatusBar } from 'react-native';
import {
    Content,
    Fab,
    Button,
    Icon,
    Spinner,
    ListItem,
    Left,
    Body,
    Right,
    Thumbnail,
    Text
} from 'native-base';
import axios from 'axios';

import ListItems from './component/ListItems';

export default class Homescreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [
                {
                    nama: 'Bee',
                    email: 'beebewijaya@gmail.com',
                    nomor: '081298129813'
                },
                {
                    nama: 'John',
                    email: 'John@gmail.com',
                    nomor: '021928918998'
                },
                {
                    nama: 'Bob',
                    email: 'bob@gmail.com',
                    nomor: '088982989829'
                }
            ],
            loading: false
        }
    }

    makeRemoteRequest = () => {
        const {page,perpage,sort} = this.state

        this.setState({ loading: true })
        setTimeout(() => {
            axios.get('http://192.168.0.23:5000/app/?page=${page}&perpage=${perpage}&sort=${sort}')
                .then(res => {
                    const newData = this.state.data.concat(res.data);
                    this.setState({
                        loading: false,
                        data: newData
                    })
                })
                .catch(err => {
                    throw err;
                });
        }, 1500)
    }

    componentDidMount() {
        this.makeRemoteRequest()
    }

    handlePostClick = (nama, email, nomor) => {
        axios.post('http://192.168.0.23:5000/contact', {
            nama, email, nomor
        })
            .then((response) => {
                const newData = this.state.data.concat(response.data);
                this.setState({
                    data: newData
                })
                this.props.navigation.popToTop()
            })
            .catch((error) => {
                throw error
            });
    }

    renderFooter = () => {
        if (this.state.loading === true) return null;
        return (
            <View>
                <Spinner color='#1e88e5' />
                <Text
                    style={{ color: '#aaa', fontSize: 12, textAlign: 'center', bottom: 10 }}
                >
                    Load more data
                </Text>
            </View >
        )
    }

    handleEdit = (nama, email, nomor, id) => {
        axios.put('http://192.168.0.23:5000/app/edit/${id}', {
            nama, email, nomor
        })
            .then((response) => {
                this.setState({
                    data: response.data,
                })
                this.props.navigation.popToTop()
            })
            .catch((error) => {
                throw error
            });
    }

    handleDelete = (id, index) => {
        axios.delete('http://192.168.0.23:5000/app/${id}')
            .then(res => {
                const newData = this.state.data.concat();
                newData.splice(index, 1);
                this.setState({
                    data: newData
                })
            })
            .catch(err => {
                throw err;
            });
    }

    renderList = (item, index) => {
        return (
            <ListItem
                style={{ marginRight: 20 }}
                avatar
                key={index}
                onPress={() => this.props.navigation.navigate('Edit', {
                    id: item._id,
                    handleEdit: this.handleEdit
                })
                }

                onLongPress={() => Alert.alert(
                    'Are you sure',
                    'you want to delete this List ?',
                    [
                        { text: 'Cancel', onPress: () => null },
                        { text: 'OK', onPress: () => this.handleDelete(item._id, index) },
                    ],
                    { cancelable: false }
                )}
            >
                <Left>
                    <Thumbnail style={{ backgroundColor: '#1e88e5' }} source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Gnome-stock_person.svg/1024px-Gnome-stock_person.svg.png' }} />
                </Left>
                <Body>
                    <Text>{item.nama}</Text>
                    <Text note>{item.email.toLowerCase()}</Text>
                    <Text note>{item.nomor}</Text>
                </Body>
            </ListItem>
        )
    }

    render() {
        return (
            <View style={styles.container}>
                <StatusBar
                    backgroundColor='#1e88e5'
                    barStyle='light-content'
                />
                <View style={{ flex: 1 }}>
                    <ListItems
                        {...this.props}
                        data={this.state.data}
                        renderList={this.renderList}
                        renderFooter={this.renderFooter}
                        // handleLoadMore={this.handleLoadMore}
                    />
                </View>
                <Fab
                    style={{ backgroundColor: '#1e88e5' }}
                    position='bottomRight'
                    onPress={
                        () => this.props.navigation.navigate('Add', {
                            handlePostClick: this.handlePostClick
                        })}>
                    <Icon name="add" />
                </Fab>
            </View >
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5FCFF',
    }
});
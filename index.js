import React, { PureComponent } from 'react';
import { TouchableOpacity, ScrollView, StyleSheet, TextInput, Image } from 'react-native';
import moment from 'moment';
import {
    Container,
    Header,
    Content,
    Icon,
    Accordion,
    Text,
    View,
    Card,
    CardItem,
    Item,
    Body,
    Left,
    Right,
    Title
} from "native-base";
import { connect } from '../../libs/connect';
import * as actions from '../../actions/reserve';
import { colors } from '../components/theme';

class ReserveItem extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            currentIndex: null
        }
    }

    onAccordionOpen = (item, expanded) => {
        // console.log(item, expanded, 'jhdgd');
        this.countSlot(item)

    }

    _renderHeader = (item, expanded) => {
        // console.log(item, 'itemmmm');
        let totalCheckin = 0;
        if (item.content && item.content.length > 0) {
            totalCheckin = item.content.filter(i => (i.acf && i.acf.attendance[0] == '1')).length;
        }
        return (
            <View
                style={{
                    flexDirection: "row",
                    padding: 10,
                    justifyContent: "space-between",
                    alignItems: "center",
                    backgroundColor: expanded ? colors.colorBgInput : '#fff'
                }}>

                <Text style={{ fontWeight: "400", color: colors.colorText }}>
                    {" "}{item.title}
                </Text>
                <Text style={{ fontWeight: "400", color: colors.colorText }}>
                    {" "}{totalCheckin + '/' + item.content.length}
                </Text>
                {expanded
                    ?
                    <Icon type='MaterialIcons' style={{ fontSize: 18, color: colors.colorText }} name="keyboard-arrow-up" />
                    :
                    // this.props.countSlot ?
                    //     <TouchableOpacity onPress={() => this.countSlot(item)}>
                    //         <Icon type='MaterialIcons' style={{ fontSize: 18, color: colors.colorText }} name="keyboard-arrow-down" />
                    //     </TouchableOpacity> :
                    <Icon type='MaterialIcons' style={{ fontSize: 18, color: colors.colorText }} name="keyboard-arrow-down" />
                }
            </View>
        );
    }
    countSlot = (slot) => {
        this.props.currentSlot(slot.content)
        // this.setState({
        //     currentSlot: slot.content
        // })
    }
    onItem = (index, item) => {
        this.setState({
            currentIndex: index
        })
        this.props.onPressItem(item.ID);
    }
    _renderContent = (items) => {
        let { options } = this.props.reserve;


        let cards = items.content.map((item, index) => {
            let iconApp = item.acf && item.acf.register_app == 'true' ? true : false;
            var item1 = item;
            let reff = options.length > 0 ? options.filter(i => {
                // console.log(i.value, item1.acf.id_referall,'1111');
                if (item1.acf.id_referall && (item1.acf.id_referall[0] == i.value)) {
                    return true;
                }
                return false;

            }) : [];
            // console.log(reff, 'options')
            return (
                item.post_title &&
                <TouchableOpacity
                    onPress={() => this.onItem(index, item)}
                    key={index}
                    style={{
                        padding: 10,
                        borderBottomColor: '#ccc',
                        borderBottomWidth: StyleSheet.hairlineWidth,
                        // backgroundColor: this.state.currentIndex == index ? colors.colorBgInput : '#fff'
                        backgroundColor: item.acf && item.acf.attendance[0] == '1' ? '#E0E0E0' : '#fff'

                    }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <View style={{ flex: 2, flexDirection: 'row', alignItems: 'center' }}>

                            <Icon type='MaterialIcons' name='star' style={{ color: reff.length > 0 ? '#005E98' : 'transparent', fontSize: 16, marginRight: 2 }} />

                            {iconApp ? (
                                <Image source={require('../../../assets/mb.png')} style={{ width: 16, height: 16, resizeMode: 'contain', }} />
                            ) :
                                (
                                    <Image source={require('../../../assets/dt.png')} style={{ width: 16, height: 16, resizeMode: 'contain', }} />
                                )
                            }


                            <Text
                                numberOfLines={2}
                                style={{
                                    color: colors.colorText,
                                    marginLeft: 12,
                                    width: 145
                                }}>
                                {item.post_title}
                            </Text>
                        </View>
                        {
                            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginLeft: 2 }}>
                                <Text
                                    numberOfLines={1}
                                    style={{
                                        // fontStyle: "italic",
                                        color: colors.colorText,
                                        fontSize: 13
                                    }}>
                                    {item.acf.mobile_number ? 'XXXX' + item.acf.mobile_number[0].slice(-4) : 'Checked In'}
                                </Text>
                            </View>
                        }

                    </View>

                </TouchableOpacity>
            )
        })
        return cards;
    }

    render() {
        const data = this.props.data;
        // const dataProps = this.props.data;
        // const data = { items: [{ ...dataProps }] }
        const dataSection = {};
        const ordered = {};

        if (data.length > 0) {
            data.map(item => {
                // const key = `${item.post_title.charAt(0).toUpperCase()}`;
                let key = moment(item.acf && item.acf.time[0], "hh:mm a").format("hh:00 a");
                if (!dataSection[key]) {
                    dataSection[key] = [];
                }
                dataSection[key].push(item)
            });

            // keysSorted = Object.keys(dataSection).sort(function(a,b){return list[a]-list[b]})
            Object.keys(dataSection).sort().forEach(function (key) {
                ordered[key] = dataSection[key];
            });
        }


        let sections = Object.keys(ordered).map(key => {
            var key1 = key;
            if (key == '12:00 pm') {
                key1 = '12:00 am';
            }
            return {
                title: key,
                sorts: moment(key1, "hh:mm a").format("a"),
                content: ordered[key]
            }
        })
        function compare(a, b) {
            if (a.sorts < b.sorts) {
                return -1;
            }
            if (a.sorts > b.sorts) {
                return 1;
            }
            return 0;
        }

        sections.sort(compare);
        if (!sections) return null;
        // console.log(sections, 'kdhjfk');

        // return (<View>
        //     <Text>111</Text>
        // </View>)

        return (
            <Content style={{ backgroundColor: "white" }}>
                <Accordion
                    dataArray={sections}
                    animation={true}
                    expanded={false}
                    renderHeader={this._renderHeader}
                    renderContent={this._renderContent}
                    onAccordionOpen={this.onAccordionOpen}
                />
            </Content>
        );
    }
}

export default connect(ReserveItem, state => ({
    reserve: state.reserve,
}), actions);


const styles = StyleSheet.create({
    wrapContent: {
        flex: 1,
        flexDirection: 'row'
    },
    wrapContentLeft: {
        flex: 1
    },
    wrapContentRight: {
        flex: 2,
        backgroundColor: '#f7f7f7',
        borderLeftColor: '#ccc',
        borderLeftWidth: StyleSheet.hairlineWidth
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    btnIcon: {
        backgroundColor: colors.background_color_header,
        padding: 3,
        borderRadius: 3,
        justifyContent: 'center',
        alignItems: 'center'
    }
})
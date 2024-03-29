import React, { useEffect } from 'react';
import { Modal } from "native-base";
import { useState, useContext } from "react";
import {
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Clipboard
} from 'react-native';
import { ThemeContext } from '../../context/ThemeContext';
import { Button } from "native-base";
import {useTranslation} from 'react-i18next';
import i18n from '../../pages/i18n';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SubmitBtn from '../../components/SubmitBtn';


const PrivateKeyModal = ({ privateKey, label }) => {
    const [showModal, setShowModal] = useState(false);
    const { theme, switchTheme } = useContext(ThemeContext);
    const handleCopyText = () => {
        Clipboard.setString(privateKey);
    };
    const {t} = useTranslation();
  useEffect(() => {
    const loadSelectedLanguage = async () => {
      try {
        const selectedLanguage = await AsyncStorage.getItem('selectedLanguage');
        if (selectedLanguage) {
          i18n.changeLanguage(selectedLanguage); 
        }
      } catch (error) {
        console.error('Error loading selected language:', error);
      }
    };
    loadSelectedLanguage();
  }, []);
  console.log(label)
    return <View>
        <TouchableOpacity onPress={() => setShowModal(true)}>
            <View
                style={[
                    styles.menuItemBig,
                    { backgroundColor: theme.menuItemBG },
                    styles.menuItem,
                ]}>
                <View style={styles.leftItem}>
                    <Image
                        source={
                            theme.type == 'dark'
                                ? require('../../assets/privatew.png')
                                : require('../../assets/privateb.png')
                        }
                        style={{ width: 25, height: 25 }} 
                    />
               <Text style={[styles.menuItemText, { color: theme.text }]}>
                {t('show')} {label === 'mnemonic' ? t('mnemonic') : label} {label === 'mnemonic' ? '' : t('private_key')}
                </Text>

                </View>

                <View
                    style={[
                        styles.rightArrow,
                        { backgroundColor: theme.rightArrowBG },
                    ]}>
                    <Image
                        source={
                            theme.type == 'dark'
                                ? require('../../assets/images/arrow-right.png')
                                : require('../../assets/images/arrow-right-dark.png')
                        }
                    />
                </View>
            </View>
        </TouchableOpacity>
        <Modal isOpen={showModal} onClose={() => setShowModal(false)} >
            <Modal.Content maxWidth="400px" style={{borderWidth:1,borderColor:theme.addButtonBorder}} >
                <Modal.CloseButton />
                <Modal.Header style={{ backgroundColor: theme.menuItemBG }}><Text style={{color:theme.text, fontSize:16,textAlign:'center'}}>{t('private_key')}</Text></Modal.Header>
                <View style={{ padding: 18, backgroundColor:theme.screenBackgroud }}>
                    <Text style={{ color: "black", textAlign: "center", marginBottom: 10, color:theme.text }}>{privateKey}</Text>
                    <SubmitBtn
              title={t('copy')}
              onPress={() => handleCopyText()}
              containerStyle={{marginHorizontal: 40,paddingVertical:10,marginTop:10}}
            />
                </View>

            </Modal.Content>
        </Modal>
    </View>;
};

export default PrivateKeyModal;

const styles = StyleSheet.create({
    menuItemBig: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderRadius: 8,
        paddingVertical: 6,
        paddingHorizontal: 12,
        marginBottom: 12,
    },
    menuItem: {
        paddingVertical: 14,
    },
    leftItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    menuItemText: {
        // color: '#FFF',
        marginLeft: 12,
        fontFamily: 'SF Pro Text',
        fontSize: 16,
        fontStyle: 'normal',
        fontWeight: '600',
        textTransform: 'capitalize',
    },
    rightArrow: {
        width: 20,
        height: 20,
        padding: 8,
        justifyContent: 'center',
        alignItems: 'flex-start',
        borderRadius: 1000,
        // backgroundColor: '#4E3B51',
    },
})
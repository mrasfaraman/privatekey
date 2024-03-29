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
import { authenticateFingerprint } from '../../utils/BiometricUtils';
import { ALERT_TYPE, Dialog, AlertNotificationRoot, Toast } from 'react-native-alert-notification';

const PrivateKeyModal = ({ privateKey, label }) => {
    const [showModal, setShowModal] = useState(false);
    const { theme, switchTheme } = useContext(ThemeContext);
    const handleCopyText = () => {
        Clipboard.setString(privateKey);
        Toast.show({
            type: ALERT_TYPE.SUCCESS,
            title: 'Copied.',
            textBody: `Private Key Copied to clipboard`,            
          });
    };
    const {t} = useTranslation();


    async function handleSubmitfingerprint() {
        let fingerprint = await authenticateFingerprint()
        console.log(fingerprint)
        if (fingerprint) {
            Dialog.show({
                type: ALERT_TYPE.WARNING,
                title: 'Show Private Key',
                textBody: `Don’t share your private key with anyone!`,
                button: 'Continue',
                onPressButton: async () => {  
                  setShowModal(true)
                  Dialog.hide()
                },
              });
        }
      }

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
    return <View>
        <TouchableOpacity onPress={() => handleSubmitfingerprint()}>
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
                    {t('show')} {label} {t('private_key')}
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
        <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
            <View style={{backgroundColor: theme.screenBackgroud}}>
            <Modal.Content maxWidth="400px">
                <Modal.CloseButton />
                <Modal.Header>{t('private_key')}</Modal.Header>
                <View style={{ padding: 12  }}>
                    <Text style={{ color: "black", textAlign: "center", marginBottom: 10 }}>{privateKey}</Text>
                    <Button size="sm" variant="outline" onPress={() => handleCopyText()}>
                    {t('copy')}
                    </Button>
                </View>

            </Modal.Content>
            </View>
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
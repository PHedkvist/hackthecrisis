import React, { useState, useCallback } from 'react';
import {
  View, StyleSheet, Text, Alert,
} from 'react-native';
import Auth from '@aws-amplify/auth';
import Button from '../components/Button';
import Input from '../components/Input';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  errorText: {
    textAlign: 'center',
    fontSize: 16,
    paddingBottom: 2,
    color: '#ff5252',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: 'gray',
    marginTop: 10,
    marginLeft: '3%',
  },
  input: {
    borderRadius: 10,
    padding: 10,
    width: '80%',
    marginBottom: 10,
  },
  button: {
    alignItems: 'center',
  },
});

export default function SignUp({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const [invalidMessage, setInvalidMessage] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState(false);
  const [authCode, setAuthCode] = useState('');

  const onChangeName = useCallback((n) => setName(n), []);
  const onChangeEmail = useCallback((e) => setEmail(e), []);
  const onChangePassword = useCallback((p) => setPassword(p), []);
  const onChangeRepeatPassword = useCallback((p) => setRepeatPassword(p), []);
  const onChangeAuthCode = useCallback((a) => setAuthCode(a), []);

  const signUp = useCallback(async () => {
    const validPassword = password.length > 5 && password === repeatPassword;
    // eslint-disable-next-line no-useless-escape
    const validateEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(
      email,
    );

    let error = false;
    if (email == null || email === '' || !validateEmail) {
      error = true;
      setErrorMessage('You must enter your email!');
    } else if (!password || password === '' || !validPassword) {
      error = true;
      setErrorMessage('You must enter your password!');
    } else if (!name || name === '') {
      error = true;
      setErrorMessage('You must enter your name!');
    } else if (password !== repeatPassword) {
      error = true;
      setErrorMessage('Password did not match');
    } else {
      setErrorMessage('');
    }

    if (!error) {
      setInvalidMessage(null);
      setConfirmDialog(true);
      Auth.signUp({
        username: email,
        password,
        attributes: {
          email, // optional
          name,
        },
        validationData: [], // optional
      })
        // eslint-disable-next-line no-console
        .then((data) => console.log(data))
        // eslint-disable-next-line no-console
        .catch((err) => console.log(err));
    }
  }, [email, name, password, repeatPassword]);

  const confirmSignUp = useCallback(async () => {
    await Auth.confirmSignUp(email, authCode)
      .then(() => {
        // await create user...
        navigation.navigate('SignIn');
        // eslint-disable-next-line no-console
        console.log('Confirm sign up successful');
      })
      .catch((err) => {
        if (!err.message) {
          Alert.alert('Error when entering confirmation code: ', err);
        } else {
          Alert.alert('Error when entering confirmation code: ', err.message);
        }
      });
  }, [email, authCode, navigation]);

  return (
    <View style={styles.container}>
      {!confirmDialog && (
        <>
          <View>
            <Text style={styles.label}>Name</Text>
            <Input
              value={name}
              placeholder="Dwayne Johnson"
              onChange={onChangeName}
              autoFocus
            />
          </View>
          <View>
            <Text style={styles.label}>Email</Text>
            <Input
              value={email}
              placeholder="email@example.com"
              onChange={onChangeEmail}
              autoCapitalize="none"
              autoCompleteType="email"
              keyboardType="email-address"
            />
          </View>
          <View>
            <Text style={styles.label}>Password</Text>
            <Input
              value={password}
              placeholder="******"
              onChange={onChangePassword}
              secureTextEntry
              autoCompleteType="password"
            />
          </View>
          <View>
            <Text style={styles.label}>Title</Text>
            <Input
              value={repeatPassword}
              placeholder="******"
              onChange={onChangeRepeatPassword}
              secureTextEntry
              autoCompleteType="password"
            />
          </View>
          <View style={styles.button}>
            <Button onPress={signUp}>
              Sign Up
            </Button>
          </View>
          <View>
            <Text style={styles.errorText}>{errorMessage}</Text>
          </View>
        </>
      )}
      {confirmDialog && (
        <>
          <Input
            value={authCode}
            style={styles.input}
            placeholder="XXX"
            onChange={onChangeAuthCode}
          />
          <Button onPress={confirmSignUp}>Confirm Sign Up</Button>
        </>
      )}
      <Text>{invalidMessage}</Text>
    </View>
  );
}


const auth = firebase.auth()

const whenSigedIn = document.getElementById('whenSigedIn')
const whenSignedOut = document.getElementById('whenSignedOut')

const signInBtn = document.getElementById('signInBtn')
const signOutBtn = document.getElementById('signOutBtn')

const userDetails = document.getElementById('userDetails')

const provider = new firebase.auth.GoogleAuthProvider()

signInBtn.onclick = () => auth.signInWithPopup(provider)

signOutBtn.onclick = () => auth.signOut()

auth.onAuthStateChanged(user => {
    if(user) {
        whenSigedIn.hidden = false
        whenSignedOut.hidden = true
        userDetails.innerHTML = `<h3>Hello ${user.displayName}!</h3> <p>User ID: ${user.uid}</p>`
    } else {
        whenSigedIn.hidden = true
        whenSignedOut.hidden = false
        userDetails.innerHTML = ``
    }
})

const db = firebase.firestore()

const createTHing = document.getElementById('createThing')
const thingsList = document.getElementById('thingsList')

let thingsRef
let unsubscribe

auth.onAuthStateChanged(user => {
    if(user) {
        thingsRef = db.collection('things')

        createThing.onclick = () => {
            thingsRef.add({
                uid: user.uid,
                name: '훼이크데이터',
                // name: faker.commerce.productName(),
                // createdAt: serverTimestamp()
                createdAt: Date.now()
            })
        }

        unsubscribe = thingsRef
            .where('uid', '==', user.uid)
            .onSnapshot(querySnapshot => {
                const items = querySnapshot.docs.map(doc => {
                    return `<li>${doc.data().name}</li>`
                })
                thingsList.innerHTML = items.join('')
            })
    } else {
        unsubscribe && unsubscribe()
    }
})
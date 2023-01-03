import { GitHubUser } from "./GitHubUser.js"

//dados
export class Favorites {
    constructor(root) {
        this.root = document.querySelector(root)
        this.load()
    }

    load() {
            this.entries = JSON.parse(localStorage.getItem('@github-favorites:')) || []
            }
    
    save() {
        localStorage.setItem('@github-favorites:', JSON.stringify(this.entries))
    }

    async add(username) {
        try {

            const userExists = this.entries.find((entry) => entry.login.toLowerCase() === username.toLowerCase()) 
        
            if(userExists) {
                throw new Error('User already exist')
            }

            const user = await GitHubUser.search(username)
            
            if (user.login === undefined) {
                throw new Error ('User not found')
            }

            this.entries = [user, ...this.entries]
            this.update()
            this.save()

        } catch (error) {
            alert(error.message)
        }
    }

    delete(user) {
        const filteredEntries = this.entries
        .filter(entry => entry.login !== user.login)

        this.entries = filteredEntries
        this.update()
        this.save()
    }
}

//functions
export class FavoritesView extends Favorites {
    constructor(root) {
        super (root)

        this.tbody = this.root.querySelector('table tbody')

        this.update()
        this.onadd()
    }

    onadd() {
        const addButton = this.root.querySelector('.search button')
        addButton.onclick = () => {
            const { value } = this.root.querySelector('.search input')

            this.add(value)
        }
    }

    update() {
        this.removeAllTr()

        this.entries.forEach( user => {
            const row = this.createRow()

            row.querySelector('.user img').src = `https://github.com/${user.login}.png`
            row.querySelector('.user a').href = `https://github.com/${user.login}`
            row.querySelector('.user p').textContent = user.name
            row.querySelector('.user span').textContent = user.login
            row.querySelector('.repositories').textContent = user.public_repos
            row.querySelector('.followers').textContent = user.followers
            row.querySelector('.remove').onclick = () => {
               const isOk = confirm('Do you have sure in delete this user?')
               if(isOk){
                this.delete(user)
               }
            }

            this.tbody.append(row)
        })
    }

    createRow(){
        const tr = document.createElement('tr')

        tr.innerHTML = `
        <td class="user">
            <img src="https://github.com/Nicholasvp.png" alt="">
            <a href="https://github.com/nicholasvp" target="_blank" >
                <p>Nicholas Pinheiro</p>
                <span>nicholasvp</span>
            </a>
        </td>
        <td class="repositories">
            76
        </td>
        <td class="followers">
            100
        </td>
        <td><button class="remove">&times;</button></td>
        `

        return tr
    }

    removeAllTr(){
        this.tbody.querySelectorAll('tr')
        .forEach((tr) => {
           tr.remove()
        })
    }
}
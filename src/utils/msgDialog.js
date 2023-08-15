/* eslint-disabled  */
import { Dialog } from 'vant'
export const notification = {
    success: ({ type, data }) => {
        const bgCard = type === 'goal' ? 'goal' : `yr-card ${type}`
        const reverse = data.who === 'away'
        const boxClass = reverse ? 'reverse' : ''
        const className = `ws-msg-notification ${bgCard} ${boxClass}`
        const goalClass = reverse ? 'away-goal' : 'home-goal'
        // 进球
        const goalHtml = `
                <div class="box flex p-l-20 p-r-10 align-center justify-between">
                    <div class="time font-16 font-500">${data.time}'</div>
                    <div class="content ${goalClass} p-r-20 flex-1 p-l-10 font-400 font-14 text-333 flex align-center flex-column">
                        <div class="home w-100 flex align-center justify-between">
                            <div class="home-name team flex align-center">
                                ${data.home_name}
                                <span class="home-goal-icon m-l-15"></span>
                            </div>
                            <span class="font-16">${data.home_score}</span>
                        </div>
                        <div class="away w-100 flex align-center justify-between">
                            <div class="home-name team flex align-center">
                                ${data.away_name}
                                <span class="away-goal-icon m-l-15"></span>
                            </div>
                            <span class="font-16">${data.away_score}</span>
                        </div>
                    </div>
                    <div class="icon m-l-30 goal">
                        
                    </div>
                </div>`
        const cardHtml = `
            <div class="box flex p-l-20 p-r-15 align-center justify-between">
                <div class="time">${data.time}'</div>
                <div class="content p-l-10 flex-1 font-16 flex align-center justify-between">
                    <div class="flex align-center ">
                        <div class="who font-14 text-333 font-400 font-medium">${data.team_name}</div>
                        <div class="card-num m-l-20 ${type}-card-num flex align-center justify-center">
                            <span class="d-inline-block  "></span>
                        </div>
                    </div>
                    <div class="cards font-12">
                        <span class="yellow item text-center text-white">${data.yellow}</span>
                        <span class="red item m-l-5 text-center text-white">${data.red}</span>
                    </div>
                </div>
                <div class="icon m-l-30 card ${bgCard}">
                    
                </div>
            </div>`
        return Dialog({
            showConfirmButton: false,
            overlay: false,
            lockScroll: true,
            allowHtml: true,
            className,
            message: type === 'goal' ? goalHtml : cardHtml
        })
    },
    close: () => {
        Dialog.close()
    }
}

Rails.application.routes.draw do
    root "game#start"

    get 'start', to: 'game#start'
    get 'main', to: 'game#main'
end

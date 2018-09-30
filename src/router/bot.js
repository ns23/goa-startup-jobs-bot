require('dotenv').config();
import BootBot from 'bootbot';
import User from '../models/User';
import Job from '../models/Job';
import log from '../logger';

const bot = new BootBot({
    accessToken: process.env.ACCESS_TOKEN,
    verifyToken: process.env.VERIFY_TOKEN,
    appSecret: process.env.APP_SECRET
});

bot.setGreetingText("Hello, I'm here to notify you about latest jobs posted on startup goa");

bot.setGetStartedButton((payload, chat) => {
    chat.say('Hello its Goa Startup Jobs bot!!!');
    User.findOne({ user_id: payload.sender.id })
        .exec((err, result) => {
            if (err) {
                log.error(err.message)
            } else if (result === null) {
                let new_record = new User({
                    user_id: payload.sender.id
                });
                new_record.save()
                    .then(() => chat.say('You are subscribed now'))
                    .catch((err) => log.error(err.message))
            } else {
                chat.say('you are already subscribed!!')
            }
        })
});

bot.hear(['latest jobs', 'new jobs', 'jobs'], (payload, chat) => {
    Job.find({})
        .sort({ posted_date: 'desc' })
        .limit(5)
        .exec((err, jobs) => {
            if (err) {
                log.error(err.message);
                chat.say('Was not able to get the latest jobs!')
            } else {
                let msg = 'Top 5 Jobs are\n';
                jobs.forEach((value) => {
                    msg += "\nTitle : " + value.job_title;
                    msg += "\nType : " + value.job_type;
                    msg += "\nPosted On : " + value.posted_date.toDateString();
                    msg += "\nMore Info : " + value.job_link;
                    msg += "\n\n";
                });

                chat.say(msg);
            }
        })
});


bot.hear('subscribe', (payload, chat) => {
    User.findOne({ user_id: payload.sender.id })
        .exec((err, result) => {
            if (err) {
                log.error(err.message);
                chat.say('Something went wrong!!')
            } else if (result === null) {
                let new_record = new User({
                    user_id: payload.sender.id
                });
                new_record.save()
                    .then(() => chat.say('You are subscribed now'))
                    .catch((err) => log.error(err))
            } else {
                chat.say('you are already subscribed!!')
            }
        })
});

bot.hear(['unsubscribe','us'], (payload, chat) => {
    chat.say({
        text: 'Are you sure you want to unsubscribe ??',
        buttons: [
            { type: 'postback', title: 'Yes', payload: 'UNSUBSCRIBE_YES' },
            { type: 'postback', title: 'No', payload: 'UNSUBSCRIBE_NO' }
        ]
    });
})

bot.on('postback:UNSUBSCRIBE_YES', (payload, chat) => {
    console.log('button was clicked');
    User
        .findOneAndRemove({ user_id: payload.sender.id })
        .exec((err, result) => {
            if (err) {
                log.error(err.message);
                chat.say('You are already unsubscribed');
            } else {
                chat.say('You are unsubscribed succesfully!!');
            }
        })
});

bot.on('postback:UNSUBSCRIBE_NO', (payload, chat) => {
    chat.say('Happy that you want to stay!!');
});


bot.hear(['hello', 'hey', 'sup'], (payload, chat) => {
    chat.say(`Hey , How are you today?`);
});

bot.hear('help', (payload, chat) => {
    chat.say('Here are the following commands for use.')
    chat.say("'latest jobs': Give top 5 latest jobs")
    chat.say("'subscribe': Automatically notify when a new job is posted")
})

bot.on('message', (payload, chat, data) => {
    if (!data.captured) {
        chat.say("I don't expect that!");
        chat.say("Please type 'help' to know command I understand!");

    }
});

export default bot;
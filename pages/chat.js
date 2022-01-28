import { Box, Text, TextField, Image, Button } from '@skynexui/components';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import appConfig from '../config.json';
import { createClient } from '@supabase/supabase-js';

import { ButtonSendSticker } from '../src/components/ButtonSendSticker';

const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTY0MzI5Mjk5NiwiZXhwIjoxOTU4ODY4OTk2fQ.WSsRRCMkUZziahuV4YnXx6Z__1_8LDYvUoTpVbOLDaw";
const SUPABASE_URL = "https://jxkuotvqdwyhteeirsqp.supabase.co";
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);


function listenerMessagesRealTime(addMessage) {
  return supabaseClient
      .from('messages')
      .on('INSERT', (responseLive) => {
        addMessage(responseLive.new);
      })
      .subscribe();
}

export default function ChatPage() {
	// Sua lógica vai aqui
	const roteamento = useRouter();
	const userLogged = roteamento.query.username;
	const [message, setMessage] = useState('');
	const [listMessage, setListMessage] = useState([]);

	useEffect( () => {
		supabaseClient
			.from('messages')
			.select('*')
			.order('id', {ascending:false})
			.then(( { data } ) => {
				setListMessage(data);
			});

    listenerMessagesRealTime( (newMessage) => {
      setListMessage((currentListValue) => {
        return [
            newMessage,
          ...currentListValue,
        ]
      });
    });

	}, []);

	function handleNewMessage(newMessage){
		const message = {
			// id: listMessage.length + 1,
			from: userLogged,
			text: newMessage,
		}

		supabaseClient
			.from('messages')
			.insert([message])
			.then(({data}) => {
        // console.log('Criando mensagem', data);
			});

		setMessage('');									
	}

    // ./Sua lógica vai aqui
    return (
			<Box
				styleSheet={{
					display: 'flex', alignItems: 'center', justifyContent: 'center',
					backgroundColor: appConfig.theme.colors.primary[500],
					backgroundImage: `url(https://virtualbackgrounds.site/wp-content/uploads/2020/08/the-matrix-digital-rain.jpg)`,
					backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundBlendMode: 'multiply',
					color: appConfig.theme.colors.neutrals['000']
				}}
			>
				<Box
					styleSheet={{
						display: 'flex',
						flexDirection: 'column',
						flex: 1,
						boxShadow: '0 2px 10px 0 rgb(0 0 0 / 20%)',
						borderRadius: '5px',
						backgroundColor: appConfig.theme.colors.neutrals[700],
						height: '100%',
						maxWidth: '95%',
						maxHeight: '95vh',
						padding: '32px',
					}}
				>
					<Header />
					<Box
						styleSheet={{
							position: 'relative',
							display: 'flex',
							flex: 1,
							height: '80%',
							backgroundColor: appConfig.theme.colors.neutrals[600],
							flexDirection: 'column',
							borderRadius: '5px',
							padding: '16px',
						}}
					>

					<MessageList messages={listMessage} />

					{/* {listMessage.map((currentMessage) => {
						// console.log(currentMessage);
							return(
								<li key={currentMessage.id}>
									{currentMessage.from}: {currentMessage.text}
								</li>
							);
						}
					)} */}

						<Box
								as="form"
								styleSheet={{
										display: 'flex',
										alignItems: 'center',
								}}
						>
							<TextField
								value={message}
								onChange={(event) => {
										setMessage(event.target.value)
									}
								}
								onKeyPress={(event) => {
										if(event.key === "Enter"){
											event.preventDefault();
											handleNewMessage(message);
										}
									}
								}
                            
								placeholder="Insira sua mensagem aqui..."
                type="textarea"
                required={true}
									styleSheet={{
											width: '100%',
											border: '0',
											resize: 'none',
											borderRadius: '5px',
											padding: '6px 8px',
											backgroundColor: appConfig.theme.colors.neutrals[800],
											marginRight: '12px',
											color: appConfig.theme.colors.neutrals[200],
									}}
							/>

							{/* Callback */}
							<ButtonSendSticker 
								onStickerClick={(sticker) => {
                    handleNewMessage(`:sticker:${sticker}`)
                  }
								}
							/>

							<Button
								type='button'
								onClick={(event) => {
										event.preventDefault();
										handleNewMessage(message);
									}
								}
                onKeyPress={(event) => {
                  if (event.key === "Enviar") {
                    event.preventDefault();
                    handleNovaMensagem(mensagem);
                  }
                }}
								label='Ok'
								buttonColors={{
									contrastColor: appConfig.theme.colors.neutrals["000"],
									mainColor: appConfig.theme.colors.primary[500],
									mainColorLight: appConfig.theme.colors.primary[400],
									mainColorStrong: appConfig.theme.colors.primary[600],
								}}
							/>
					</Box>
				</Box>
			</Box>
		</Box>
	)
}

function Header() {
    return (
        <>
            <Box styleSheet={{ width: '100%', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }} >
                <Text variant='heading5'>
                    Chat
                </Text>
                <Button
                    variant='tertiary'
                    colorVariant='neutral'
                    label='Logout'
                    href="/"
                />
            </Box>
        </>
    )
}

function MessageList(props) {
    return (
        <Box
            tag="ul"
            styleSheet={{
                overflowY: 'scroll',
                display: 'flex',
                flexDirection: 'column-reverse',
                flex: 1,
                color: appConfig.theme.colors.neutrals["000"],
                marginBottom: '16px',
            }}
        >
		{
			props.messages.map((message) => {
				return(
					<Text
						key={message.id}
						tag="li"
						styleSheet={{
							borderRadius: '5px',
							padding: '6px',
							marginBottom: '12px',
							hover: {backgroundColor: appConfig.theme.colors.neutrals[700],}
						}}
					>
						<Box
							styleSheet={{
								marginBottom: '8px',
							}}
						>
							<Image
								styleSheet={{
									width: '20px',
									height: '20px',
									borderRadius: '50%',
									display: 'inline-block',
									marginRight: '8px',
								}}
								src={`https://github.com/${message.from}.png`}
							/>
							<Text tag="strong">
								{message.from}
							</Text>
							<Text
								styleSheet={{
									fontSize: '10px',
									marginLeft: '8px',
									color: appConfig.theme.colors.neutrals[300],
								}}
								tag="span"
							>
							{(new Date().toLocaleDateString())}
							</Text>
						</Box>
	
						{message.text.startsWith(':sticker:') 
							? 
							( <Image 
                  styleSheet={{
                    width: '20%',
                    height: 'auto',
                    display: 'inline-block',
                    marginRight: '8px',
                  }}
                  src={message.text.replace(':sticker:', '')} /> 
              )
							:
							( message.text )
						}
		
    			</Text>
				);
			})
		}
    </Box>
  )
}

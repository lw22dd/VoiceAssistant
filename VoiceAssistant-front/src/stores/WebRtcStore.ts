import { defineStore } from 'pinia';
import { ref, Ref } from 'vue';
import { useWebSocketStore } from '@/stores/WebSocketStore';
import { WebSocketMessageType } from '@/enums/WebSocketMessageType';
import { useAssistantStore } from '@/stores/AssistantStore';


export const useWebRTCStore = defineStore('webRTC', () => {
    const webSocketStore = useWebSocketStore();
    const assistantStore = useAssistantStore();

    // 状态定义
    const peerConnection: Ref<RTCPeerConnection | null> = ref(null);
    const localStream: Ref<MediaStream | null> = ref(null);
    const isRTCConnected: Ref<boolean> = ref(false);
    const audioElement: Ref<HTMLAudioElement | null> = ref(null);
    const isMicrophoneEnabled = ref(true)

    // 初始化 WebRTC 连接
    const initialize = async () => {
        try {
            // 获取麦克风权限
            localStream.value = await navigator.mediaDevices.getUserMedia({ audio: true });
            // 初始化 PeerConnection
            peerConnection.value = new RTCPeerConnection({
                iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
            });
            // 添加本地音轨
            localStream.value.getTracks().forEach(track => {
                peerConnection.value!.addTrack(track, localStream.value!);
            });


            /*设置三个监听函数 */
            // ICE 候选生成，On ICE 候选回调 API
            peerConnection.value.onicecandidate = (event) => {
                if (event.candidate && webSocketStore.client?.getStatus() === 'OPEN') {
                    sendCandidate(event.candidate);
                }
            };
            // 注册 ICE 连接状态变化
            peerConnection.value.oniceconnectionstatechange = (event) => {
                console.log('oniceconnectionstatechange', event);
            };
            // 设置远程流处理 On 注册远程轨道回调
            peerConnection.value.ontrack = (event) => {
                console.log('ontrack', event.track.kind);

                if (event.track.kind === 'audio') {
                    event.track.enabled = true;
                    handleAudioTrack(event.track);//这里接收track *webrtc.TrackRemote

                }
            };

            if (!audioElement.value) {
                audioElement.value = document.createElement('audio');
                audioElement.value.autoplay = true; // 自动播放
                audioElement.value.controls = false; // 隐藏控件
                audioElement.value.muted = false; // 不静音
                document.body.appendChild(audioElement.value);
            }

            isRTCConnected.value = true;
            localStream.value.getAudioTracks().forEach(track => {
                track.enabled = true
            })
            return true;
        } catch (error) {
            console.error('WebRTC 初始化失败:', error);
            return false;
        }
    };
    const sendCandidate = async (candidate: RTCIceCandidateInit) => {
        if (!peerConnection.value) return;
        const candidateJSON = JSON.stringify(candidate);


        webSocketStore.sendMessage({
            id: `candidate-${Date.now()}`,
            type: WebSocketMessageType.candidate,
            candidate: candidateJSON
        });

    }
    // 处理音频轨道，onTrack只触发HandleAudioTrack执行一次
    const handleAudioTrack = (track: MediaStreamTrack) => {
        console.log('开始处理音频轨道 handleAudioTrack（直接播放）');
        try {
            const mediaStream = new MediaStream([track]);

            if (audioElement.value) {
                audioElement.value.srcObject = mediaStream;
                console.log('已将音频流绑定到audio元素，开始播放');
            }


            // 监听轨道结束事件
            track.onended = () => {
                console.log('音频轨道已结束');
                if (audioElement.value) {
                    audioElement.value.srcObject = null; // 清除流
                }
            };

        } catch (error) {
            console.error('处理音频轨道失败:', error);
        }
    };

    // 开始通话
    const startCall = async () => {
        if (!peerConnection.value) {
            await initialize();
        }

        if (!peerConnection.value) return;

        try {
            // 创建并发送 Offer，设置本地描述
            const offer = await peerConnection.value.createOffer();
            await peerConnection.value.setLocalDescription(offer);

            if (webSocketStore.client?.getStatus() === 'OPEN') {
                // 调用WS发送offer
                console.log('发送 offer和assistantID',assistantStore.selectedAssistantId);
                webSocketStore.sendMessage({
                    type: WebSocketMessageType.offer,
                    data: {
                        sdp:peerConnection.value.localDescription?.sdp,// call的内容是PeerConnection的本地描述
                        assistantId:assistantStore.selectedAssistantId.toString(),
                    }, 
                });
            }

            return true;
        } catch (error) {
            console.error('创建 Offer 失败:', error);
            return false;
        }
    };

    // 结束通话
    const endCall = () => {
        if (peerConnection.value) {
            peerConnection.value.close();
            peerConnection.value = null;
        }
        if (localStream.value) {
            localStream.value.getTracks().forEach(track => track.stop());
            localStream.value = null;
        }
        if (audioElement.value) {
            audioElement.value.srcObject = null;
            document.body.removeChild(audioElement.value);
            audioElement.value = null;
        }
        isRTCConnected.value = false;
        console.log('执行挂断')
        webSocketStore.sendMessage({
            type: WebSocketMessageType.hangup, // 确保 WebSocketMessageType 中定义了 hangup 类型
            data: { action: 'hangup' }
        });
        isMicrophoneEnabled.value = false
    };

    // 处理 Answer
    const handleAnswer = async (ans: any) => {
        if (!peerConnection.value) return;
        // 如果ans是字符串，尝试解析为JSON对象
        const answerObj = typeof ans === 'string' ? JSON.parse(ans) : ans;

        try {


            // 设置远程描述
            await peerConnection.value.setRemoteDescription(ans);

            console.log("Web RTC连接已建立")
            return true;
        } catch (error) {
            console.error('处理 Answer 失败:', error);
            return false;
        }
    };

    // 处理 Candidate
    const handleCandidate = async (candidate: RTCIceCandidateInit) => {
        if (!peerConnection.value) return;

        try {
            await peerConnection.value.addIceCandidate(new RTCIceCandidate(candidate));
            return true;
        } catch (error) {
            console.error('处理 ICE 候选失败:', error);
            return false;
        }
    };

    // 在 store 中添加
    const enableMicrophone = () => {
        if (localStream.value) {
            localStream.value.getAudioTracks().forEach(track => {
                track.enabled = true
            })
            isMicrophoneEnabled.value = true
        }
    }

    const disableMicrophone = () => {
        if (localStream.value) {
            localStream.value.getAudioTracks().forEach(track => {
                track.enabled = false
            })
            isMicrophoneEnabled.value = false
        }
    }
    return {
        peerConnection,
        localStream,
        isRTCConnected,
        initialize,
        startCall,
        endCall,
        handleAnswer,
        handleCandidate,
        enableMicrophone,
        disableMicrophone,
    };
});
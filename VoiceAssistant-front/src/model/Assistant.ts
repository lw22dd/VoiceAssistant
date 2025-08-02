export interface Assistant {
    id: string
    name: string
    description?: string
    model: string
    prompt?: string
    //voiceStyle: VoiceStyle
    avatar?: string

}
type VoiceStyle = {
    speed: number
    pitch: number
    volume: number
    emotion: string
    temperature: number
}
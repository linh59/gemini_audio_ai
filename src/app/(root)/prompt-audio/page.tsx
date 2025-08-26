import MyForm from "@/app/(root)/prompt-audio/form"


const PromptAudio = () => {


    return (
        <div className="mx-auto max-w-2xl p-6">
            {/* Header */}
            <header className="mb-6">
                <h1 className="text-2xl font-semibold tracking-tight">Gemini TTS — Single Voice & Multi-Speaker</h1>

            </header>
            <MyForm></MyForm>





        </div>
    )
}
export default PromptAudio
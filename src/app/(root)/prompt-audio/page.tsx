import MyForm from "@/components/audio/form"


const PromptAudioPage = () => {


    return (
        <div >
            <div className="mb-4">
                <h1 className="title">
                    Single Voice
                </h1>
                <p className="text-lg text-muted-foreground font-poppins">
                    Paste English text to generate audio or a study-ready vocabulary list, then learn on the Vocabulary page with draggable sticky notes.                </p>
            </div>
            <MyForm></MyForm>



        </div>
    )
}
export default PromptAudioPage
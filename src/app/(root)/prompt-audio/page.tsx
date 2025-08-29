import MyForm from "@/app/(root)/prompt-audio/form"


const PromptAudioPage = () => {


    return (
        <div >
            <div className="mb-4">
                <h1 className="title">
                    Single Voice
                </h1>
                <p className="text-lg text-muted-foreground font-poppins">
                    Generate audio with one selected voice—clean, consistent, and perfect for narration or tutorials.
                </p>
            </div>


            <MyForm></MyForm>


        </div>
    )
}
export default PromptAudioPage
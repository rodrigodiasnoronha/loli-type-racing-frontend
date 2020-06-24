<template>
    <div
        v-if="loading"
        style="display: flex; justify-content: center; align-items: center;"
    >
        <v-progress-circular :indeterminate="true"></v-progress-circular>
    </div>

    <v-row v-else>
        <v-col cols="12 mb-5">
            <LoliRace :loli-position="loliPosition" />
        </v-col>

        <v-col col="12">
            <v-card
                style="margin-left: auto; margin-right: auto;"
                :max-width="700"
                width="100%"
            >
                <v-card-title>
                    <v-btn
                        v-on:click="restart()"
                        color="#e91e63"
                        :dark="true"
                        class="ml-2"
                        >Restart</v-btn
                    >
                    <v-btn
                        :disabled="false"
                        color="#e91e63"
                        :dark="true"
                        class="ml-2"
                        >{{ time }}</v-btn
                    >
                </v-card-title>

                <v-card-text>
                    <v-row>
                        <v-col cols="12">
                            <v-card>
                                <v-card-text class="contentContainer">
                                    <span
                                        class="firstWord text-h6"
                                        v-if="typed.length <= 0"
                                        >{{ renderFirstWord }}</span
                                    >
                                    <span
                                        v-else-if="!words[0].indexOf(typed)"
                                        class="rightWord firstWord text-h6"
                                        >{{ renderFirstWord }}</span
                                    >
                                    <span
                                        v-else
                                        class="wrongWord firstWord text-h6"
                                        >{{ renderFirstWord }}</span
                                    >
                                    <span class="text-h6">
                                        {{ renderRestWords }}
                                    </span>
                                </v-card-text>
                            </v-card>
                        </v-col>

                        <v-col cols="12">
                            <v-text-field
                                    color="#c2185b"
                                v-model="typed"
                                @keyup="onTypedInputChange()"
                                type="text"
                                label="Type..."
                            ></v-text-field>
                        </v-col>
                    </v-row>
                </v-card-text>
            </v-card>
        </v-col>

        <v-col cols="12">
            <v-dialog max-width="700px" v-model="gameFinished">
                <v-card>
                    <v-card-title>Time finished</v-card-title>

                    <v-card-subtitle
                        >{{ name }}'s time: {{ result }}</v-card-subtitle
                    >

                    <v-card-text>
                        <p class="text-h5">
                            You can type {{ wordsTyped.length }} words in 1
                            minute
                        </p>
                        <p class="text-h5">
                            Total of letters typed in 1 minute:
                            {{ totalLettersTyped }}
                        </p>
                    </v-card-text>
                    <v-card-actions>
                        <v-btn @click="restart" color="primary">OK</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
        </v-col>
    </v-row>
</template>

<script>
import paragraphs from '../utils/phrases';
import LoliRace from './LoliRace';
import api from '../services/api';

export default {
    name: 'Game',
    data: () => ({
        typed: '',
        words: paragraphs[Math.floor(Math.random() * paragraphs.length)],
        time: 60,
        started: false,
        intervalId: null,
        loliPosition: '0%',
        gameFinished: false,
        result: '',
        wordsTyped: [],
        totalLettersTyped: 0,
        loading: true,
        registered: false,
    }),
    mounted() {
        this.loading = false;
    },
    props: {
        name: String,
    },
    watch: {
        time(time) {
            this.updatedLoliPosition(time);
        },
    },
    components: {
        LoliRace,
    },
    computed: {
        renderFirstWord() {
            const [firstWord] = this.words;
            return firstWord;
        },

        renderRestWords() {
            const [, ...rest] = this.words;
            return rest.join(' ');
        },
    },

    methods: {
        onTypedInputChange() {
            const result = this.verifyWordsMatch();

            // verifica se é necessário resetar o input
            if (result) {
                this.typed = '';
            }
        },

        restart() {
            clearInterval(this.intervalId);
            this.started = false;
            this.time = 60;
            this.words =
                paragraphs[Math.floor(Math.random() * paragraphs.length)];
            this.loliPosition = '0%';
            this.typed = '';
            this.gameFinished = false;
            this.registered = false;
        },

        startGame() {
            this.started = true;

            if (this.intervalId) {
                clearInterval(this.intervalId);
                this.time = 60;
            }

            this.intervalId = setInterval(async () => {
                if (this.time >= 1) {
                    this.time -= 1;
                } else {
                    await this.finishGame();
                }
            }, 1000);
        },

        verifyWordsMatch() {
            // inicia o jogo se ele não estiver iniciado
            if (!this.started) {
                this.startGame();
            }

            // retira espaços do campo digitado
            const typedFormated = this.typed;
            this.typed = typedFormated.trim();

            // se a palavra for totalmente igual limpar input & remover palavra do array de palavras & add palavras digitadas
            if (this.words[0] === this.typed) {
                this.wordsTyped.push(this.words[0]);
                this.words.shift();
                return true;
            }

            // se tiver poucas palavras no array words ele coloca mais palavras
            if (this.words.length <= 10) {
                const words = this.words;
                this.words = [
                    ...words,
                    ...paragraphs[
                        Math.round(Math.random() * paragraphs.length)
                    ],
                ];
            }
            return false;
        },

        updatedLoliPosition(time) {
            const result = (time * 100) / 60;
            this.loliPosition = `${100 - result.toFixed(0)}%`;
        },

        async finishGame() {
            this.gameFinished = true;

            // calcula o total de palavras digitadas e o total de letras digitadas
            const total = this.wordsTyped.reduce((acumulator, item) => {
                return acumulator + item.length;
            }, 0);
            this.totalLettersTyped = total;

            try {
                if (!this.registered) {
                    await api.post('/players', {
                        name: this.name,
                        words_typed: this.wordsTyped.length,
                        letters_typed: total,
                    });

                    this.registered = true;
                }
            } catch (err) {
                alert('Ocorreu um erro ao cadastrar seu recorde');
            }
        },
    },
};
</script>

<style>
.firstWord {
    color: #333;
}

.wrongWord {
    color: #f44336 !important;
}

.rightWord {
    color: #64dd17 !important;
}

.contentContainer {
    height: 150px;
    max-height: 150px;
    overflow: hidden;
}
</style>

<template>
    <v-container>
        <v-card
            style="margin-left: auto; margin-right: auto;"
            :max-width="700"
            width="100%"
            v-if="!showGame"
        >
            <v-card-title>Loli Type Racing</v-card-title>
            <v-card-subtitle>Test your typing skills</v-card-subtitle>

            <v-card-text>
                <v-text-field
                    :rules="inputNameRules"
                    label="Name"
                    v-model="name"
                ></v-text-field>

                <v-row>
                    <v-col cols="6">
                        <v-btn
                            v-on:click="start()"
                            :block="true"
                            color="#303f9f"
                            :dark="true"
                            >Start</v-btn
                        >
                    </v-col>
                    <v-col cols="6">
                        <v-btn :block="true" color="#303f9f" :dark="true"
                            >Cancel</v-btn
                        >
                    </v-col>
                </v-row>
            </v-card-text>
        </v-card>

        <Game v-else  :name="name" />
    </v-container>
</template>

<script>
import Game from './Game';

export default {
    name: 'TypeRacing',
    data: () => ({
        showGame: false,
        started: false,
        name: '',
        inputNameRules: [(value) => !!value || 'Required'],
    }),
    components: {
        Game,
    },

    methods: {
        start() {
            this.showGame = true;
        },
    },
};
</script>

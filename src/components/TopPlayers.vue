<template>
    <v-card v-if="loading">
        <v-card-title>
            <div
                style="
                    width: 100%;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                "
            >
                <v-progress-circular :indeterminate="true">
                </v-progress-circular>
            </div>
        </v-card-title>
    </v-card>
    <v-card v-else>
        <v-card-title>Top players</v-card-title>

        <v-simple-table>
            <thead>
                <tr>
                    <th>Position</th>
                    <th>Name</th>
                    <th>Words per minute</th>
                    <th>
                        Total letters typed
                    </th>

                </tr>
            </thead>

            <tbody>
                <tr :key="index" v-for="(p, index) in players">
                    <td>
                        {{index + 1}}
                    </td>
                    <td>
                        {{ p.name }}
                    </td>
                    <td>
                        {{ p.words_typed}}
                    </td>

                    <td>
                        {{p.letters_typed}}
                    </td>
                </tr>
            </tbody>
        </v-simple-table>
    </v-card>
</template>

<script>
import api from '../services/api';

export default {
    name: 'TopPlayers',
    data: () => ({
        players: [],
        error: false,
        loading: true,
    }),
    async mounted() {
        try {
            const response = await api.get('/players');
            this.players = response.data;
            this.loading = false;
        } catch (err) {
            console.log('error ao pegar jogadores', err);
        }
    },
};
</script>

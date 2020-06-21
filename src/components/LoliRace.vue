<template>
    <v-container>
        <div id="container">
            <div id="racer-container">
                <div :style="{ width: loliPosition }" class="loli-container">
                    <img
                        class="loli"
                        :src="personagem"
                        height="40"
                        alt="loli"
                        title="loli"
                    />
                </div>
            </div>
            <div id="finish-line-container">
                <img
                    height="50"
                    class="finish"
                    :src="finish"
                    alt="finish line"
                    title="finish line"
                />
            </div>
        </div>
    </v-container>
</template>

<script>
import personagem from '../assets/personagem.gif';
import finish from '../assets/finish.png';

export default {
    name: 'LoliRace',
    data: () => ({
        personagem,
        finish,
    }),
    props: {
        loliPosition: String,
    },
};
</script>

<style>
#container {
    display: flex;
    height: 100px;
}

#racer-container {
    flex: 9;
}

#finish-line-container {
    flex: 1;
}

.loli-container {
    display: flex;
    justify-content: flex-end;
    align-items: flex-end;
}
</style>

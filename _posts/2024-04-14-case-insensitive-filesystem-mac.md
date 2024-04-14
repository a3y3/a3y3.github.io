---
layout: post
title:  "Filenames are case insensitive on MacOS"
categories: general
tags: featured
---
I recently wrote a unit test that consumed a file and used it for whatever purpose in GoLang. It worked locally, I added, committed and pushed it to my remote that then triggered a build + test Jenkins job for my project.

I was surprised to find that the unit test failed on Jenkins - the error said that the file the unit test was referencing was not found. It seemed pretty strange - I re-ran the unit test locally, made sure that I had indeed added and committed the file being referenced, everything seemed to check out. Could it be the fact that I was using relative addresses for referencing the file? No, that couldn't be it - the other unit tests were also referencing files using relatives addresses.

And then I caught it - the file my unit test was consuming was named `testFile.txt`. However, I had referenced it as `testfile.txt` in my unit test.

But then, this meant that Jenkins was correct in saying that the file was not found and failing the unit test. How was it working on my local machine?

I wrote the following program in my playground to test it out. All it does is try to open `testFile.txt` with various case flipped names:
{% highlight golang %}
func main() {
	fileNames := []string{"testFile.txt", "testfile.txt", "TestFile.txt", "TESTFILE.TXT", "tEsTFilE.Txt"}
	for _, fileName := range fileNames {
		file, err := openFile(fileName)
		if err != nil {
			fmt.Printf("Error opening file %s: %v\n", fileName, err)
			continue
		}
		content, _ := io.ReadAll(file)
		fmt.Printf("%s\n", string(content)) // THIS PRINTS SUCCESSFULLY FOR ALL fileNames THIS MAKES NO SENSE
	}
}

func openFile(fileName string) (*os.File, error) {
	file, err := os.Open(fileName)
	if err != nil {
		return nil, err
	}
	return file, nil
}
{% endhighlight %}

This was the output:
<img class="img-div-fit" src="/assets/images/case-insensitive-hello-world.png">
Unsurprisingly, `Hello World` was printed out for all the file names! A bit of quick Googling revealed that MacOS's file system (my local machine) treats files as case insensitive by default. However, Linux doesn't.

Just something to keep in mind about.
